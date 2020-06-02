var express = require('express');

var mAutentication = require('../middlewares/autentication');

var app = express();

var Hospital = require('../models/hospital');
/**
 * Obtener Todos los Hospitales
 */

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({}, 'nombre img usuario')
        .skip(desde)
        .limit(10)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error en carga de los hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales,
                        total: conteo
                    });
                });
            });
});

/**
 * Crear un Hospital
 */

app.post('/', mAutentication.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear un Hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuarioToken: req.usuario
        });
    });
});

/**
 * Actualizar Hospital
 */

app.put('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe.',
                errors: { message: 'No existe el hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
                usuarioToken: req.usuario
            });
        });

    });
});
/**
 * Eliminar Hospital
 */

app.delete('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el hospital con ese ID',
                errors: { message: 'No existe el hospital con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado,
            usuarioToken: req.usuario
        });
    });
});


module.exports = app;