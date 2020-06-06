var express = require('express');

var app = express();

// Middeleware
var mAutentication = require('../middlewares/autentication');

// Modelos
var Pais = require('../models/pais');

/**
 * Obtener Todos los Paises
 */
app.get('/', (req, res, next) => {

    Pais.find({}, 'name description')
        .exec(
            (err, paises) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error en carga de Paises',
                        errors: err
                    });
                }

                Pais.count({}, (err, conteo) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error en carga de Paises',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        // usuarios: usuarios
                        paises,
                        total: conteo
                    });
                });
            });

});

/**
 * Crear un Pais
 */

app.post('/', mAutentication.verificaToken, (req, res, next) => {

    var body = req.body;

    var pais = new Pais({
        name: body.name,
        description: body.description,
        usuario: req.usuario._id,
    });

    pais.save((err, paisGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear Pais',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            pais: paisGuardado,
            usuarioToken: req.usuario
        });
    });

});

/**
 * Actualizar un Pais
 */
app.put('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Pais.findById(id, (err, pais) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Pais',
                errors: err
            });
        }

        if (!pais) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El pais con el id ' + id + ' no existe.',
                errors: { message: 'No existe un pais con ese ID' }
            });
        }

        pais.name = body.name;
        pais.description = body.description;
        pais.usuario = req.usuario._id;

        pais.save((err, paisGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el Pais',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                pais: paisGuardado,
                usuarioToken: req.usuario
            });
        });

    });
});

/**
 * Eliminar Pais
 */
app.delete('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;

    Pais.findByIdAndRemove(id, (err, paisBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Pais',
                errors: err
            });
        }

        if (!paisBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un pais con ese ID',
                errors: { message: 'No existe un pais con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            pais: paisBorrado,
            usuarioToken: req.usuario
        });
    });
});
module.exports = app;