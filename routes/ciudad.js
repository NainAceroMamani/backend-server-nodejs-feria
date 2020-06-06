var express = require('express');

var app = express();

// Middeleware
var mAutentication = require('../middlewares/autentication');

// Modelos
var Ciudad = require('../models/ciudad');

/**
 * Obtener Todos los Ciudades
 */
app.get('/', (req, res, next) => {

    Ciudad.find({}, 'name description img pais')
        .populate('pais')
        .exec(
            (err, ciudades) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error en carga de Ciudades',
                        errors: err
                    });
                }

                Ciudad.count({}, (err, conteo) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error en carga de Ciudades',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        ciudades,
                        total: conteo
                    });
                });
            });

});

/**
 * Crear una Ciudad
 */

app.post('/', mAutentication.verificaToken, (req, res, next) => {

    var body = req.body;

    var ciudad = new Ciudad({
        name: body.name,
        description: body.description,
        pais: body.pais,
        usuario: req.usuario._id,
    });

    ciudad.save((err, ciudadGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear la Ciudad',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            ciudad: ciudadGuardado,
            usuarioToken: req.usuario
        });
    });

});

/**
 * Actualizar Ciudad
 */
app.put('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Ciudad.findById(id, (err, ciudad) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Ciudad',
                errors: err
            });
        }

        if (!ciudad) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La ciudad con el id ' + id + ' no existe.',
                errors: { message: 'No existe la ciudad con ese ID' }
            });
        }

        ciudad.name = body.name;
        ciudad.description = body.description;
        ciudad.pais = body.pais;
        ciudad.usuario = req.usuario._id;

        ciudad.save((err, ciudadGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la Ciudad',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                ciudad: ciudadGuardado,
                usuarioToken: req.usuario
            });
        });

    });
});

/**
 * Eliminar Ciudad
 */

app.delete('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;

    Ciudad.findByIdAndRemove(id, (err, ciudadBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar la Ciudad',
                errors: err
            });
        }

        if (!ciudadBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe la Ciudad con ese ID',
                errors: { message: 'No existe la Ciudad con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            ciudad: ciudadBorrado,
            usuarioToken: req.usuario
        });
    });
});

module.exports = app;