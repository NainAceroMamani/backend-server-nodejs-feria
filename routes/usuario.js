var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mAutentication = require('../middlewares/autentication');

var app = express();
// var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

/**
 * Obtener Todos los Usuarios
 */

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img rol')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error en carga de Usuarios',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    // usuarios: usuarios
                    usuarios
                });
            });
});

/**
 * Middleware - Verificar Token
 */

// app.use('/', (req, res, next) => {

//     var token = req.query.token;

//     jwt.verify(token, SEED, (err, decoded) => {

//         if (err) {
//             returnres.status(401).json({
//                 ok: false,
//                 mensaje: 'Token incorrecto',
//                 errors: err
//             });
//         }

//         next();
//     });

// });

/**
 * Crear un usuario
 */

app.post('/', mAutentication.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear Usuario',
                errors: err
            });
        }

        usuarioGuardado.password = "";

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

/**
 * Actualizar Usuario
 */

app.put('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe.',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = "";

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            });
        });

    });
});

/**
 * Eliminar Usuario
 */
app.delete('/:id', mAutentication.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuarioBorrado.password = "";

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
            usuarioToken: req.usuario
        });
    });
});

module.exports = app;