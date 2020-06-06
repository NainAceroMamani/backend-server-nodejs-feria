var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();
// Middeleware
var mAutentication = require('../middlewares/autentication');

var Usuario = require('../models/usuario');

/**
 * Obtener Todos los Usuarios
 */
app.get('/', mAutentication.verificaToken, (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'name sur_name email img rol')
        .skip(desde)
        .limit(10)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error en carga de Usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al contar Usuarios',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        // usuarios: usuarios
                        usuarios,
                        total: conteo
                    });
                });
            });
});

/**
 * Registro Publico
 */
app.post('/create', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        name: body.name,
        sur_name: body.sur_name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10)
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
            usuario: usuarioGuardado
        });
    });
});

/**
 * Registro Todos los Usuarios
 */
app.post('/', mAutentication.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        name: body.name,
        sur_name: body.sur_name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
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
            usuario: usuarioGuardado
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

        usuario.name = body.name;
        usuario.sur_name = body.sur_name;
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
                usuario: usuarioGuardado
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