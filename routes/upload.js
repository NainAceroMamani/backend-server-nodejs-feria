var express = require('express');
var fileUpload = require('express-fileupload');
// para Borrar IMG
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Pais = require('../models/pais');
var Ciudad = require('../models/ciudad');

// Middeleware
app.use(fileUpload());
var mAutenticationUser = require('../middlewares/autenticationUser');

app.put('/:tipo/:id', mAutenticationUser.verificaToken, (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colección válidos
    var tipoValidos = ['usuarios', 'paises', 'ciudades'];
    if (tipoValidos.indexOf(tipo) < 0) { // devolverá -1 si no lo encuentra
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida.',
            errors: { message: 'Tipo de colección no es válida.' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.'); // sólo necesitamos el último elemento => []
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aeptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) { // devolverá -1 si no lo encuentra
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') } // join para que separe al array con ","
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover del archivo temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido'
        // });
        subirPorTipo(tipo, id, nombreArchivo, res, req);

    });
});

function subirPorTipo(tipo, id, nombreArchivo, res, req) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al subir archivo',
                    errors: err
                });
            }

            if (req.usuario.role != 'ADMIN_ROLE') {
                if (req.usuario._id != usuario.id) {

                    return res.status(403).json({
                        ok: false,
                        mensaje: 'No tiene permisos',
                        errors: err
                    });
                }
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id ' + id + ' no existe.',
                    errors: { message: 'No existe un usuario con ese ID' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Verificamos que no venga null
            if (usuario.img) {
                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = "";
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo === 'paises') {

        Pais.findById(id, (err, pais) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al subir archivo',
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

            if (req.usuario.role != 'ADMIN_ROLE') {

                return res.status(403).json({
                    ok: false,
                    mensaje: 'No tiene permisos',
                    errors: err
                });
            }

            var pathViejo = './uploads/paises/' + pais.img;

            // Verificamos que no venga null
            if (pais.img) {
                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
            }

            pais.img = nombreArchivo;
            pais.usuario = req.usuario._id;

            pais.save((err, paisActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del pais actualizado',
                    ciudad: paisActualizado
                });
            });
        });
    }

    if (tipo === 'ciudades') {

        Ciudad.findById(id, (err, ciudad) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al subir archivo',
                    errors: err
                });
            }

            if (!ciudad) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La ciudad con el id ' + id + ' no existe.',
                    errors: { message: 'No existe una ciudad con ese ID' }
                });
            }

            if (req.usuario.role != 'ADMIN_ROLE') {

                return res.status(403).json({
                    ok: false,
                    mensaje: 'No tiene permisos',
                    errors: err
                });
            }

            var pathViejo = './uploads/ciudades/' + ciudad.img;

            // Verificamos que no venga null
            if (ciudad.img) {
                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
            }

            ciudad.img = nombreArchivo;
            ciudad.usuario = req.usuario._id;

            ciudad.save((err, ciudadActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de la ciudad actualizado',
                    ciudad: ciudadActualizado
                });
            });
        });
    }

}

module.exports = app;