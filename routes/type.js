var express = require('express');

var app = express();

// Middeleware
var mAutentication = require('../middlewares/autentication');

// Modelos
var Type = require('../models/type');

/**
 * Obtener Todos los Tipos de Documentos
 */
app.get('/', (req, res, next) => {

    Type.find({}, 'name description')
        .exec(
            (err, types) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error en carga de los Tipos de Documentos',
                        errors: err
                    });
                }

                Type.count({}, (err, conteo) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error en carga de los Tipo de Documentos',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        // usuarios: usuarios
                        types,
                        total: conteo
                    });
                });
            });

});

/**
 * Crear Tipo de Documento
 */

app.post('/', mAutentication.verificaToken, (req, res, next) => {

    var body = req.body;

    var type = new Type({
        name: body.name,
        description: body.description,
        usuario: req.usuario._id
    });

    type.save((err, typeGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en carga del Tipo de Documento',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            type: typeGuardado,
            usuarioToken: req.usuario
        });
    });

});

/**
 * Actualizar Tipo de Documento
 */
app.put('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Type.findById(id, (err, type) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el Tipo de Documento',
                errors: err
            });
        }

        if (!type) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Tipo de Documento con el id ' + id + ' no existe.',
                errors: { message: 'No existe un Tipo de Documento con ese ID' }
            });
        }

        type.name = body.name;
        type.description = body.description;
        type.usuario = req.usuario._id;

        type.save((err, typeGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el Tipo de Documento',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                pais: typeGuardado,
                usuarioToken: req.usuario
            });
        });

    });
});

/**
 * Eliminar Tipo de Documento
 */
app.delete('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;

    Type.findByIdAndRemove(id, (err, typeBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el Tipo de Documento',
                errors: err
            });
        }

        if (!typeBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un Tipo de Documento con ese ID',
                errors: { message: 'No existe un Tipo de Documento con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            type: typeBorrado,
            usuarioToken: req.usuario
        });
    });
});

module.exports = app;