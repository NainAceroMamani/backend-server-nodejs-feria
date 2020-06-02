var express = require('express');

var mAutentication = require('../middlewares/autentication');

var app = express();

var Medico = require('../models/medico');
/**
 * Obtener Todos los Médicos
 */

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre img usuario hospital')
        .skip(desde)
        .limit(10)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error en carga de los hospitales',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos,
                        total: conteo
                    });
                });
            });
});

/**
 * Crear un Médico
 */

app.post('/', mAutentication.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear un Hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioToken: req.usuario
        });
    });
});

/**
 * Actualizar un Médico
 */

app.put('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un Médico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El médico con el id ' + id + ' no existe.',
                errors: { message: 'No existe el médico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar un Médico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado,
                usuarioToken: req.usuario
            });
        });

    });
});
/**
 * Eliminar Médico
 */

app.delete('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar un Médico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el médico con ese ID',
                errors: { message: 'No existe el médico con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado,
            usuarioToken: req.usuario
        });
    });
});


module.exports = app;