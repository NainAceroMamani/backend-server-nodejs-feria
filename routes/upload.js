var express = require('express');
var fileUpload = require('express-fileupload');
// para Borrar IMG
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// Middeleware
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colección válidos
    var tipoValidos = ['hospitales', 'usuarios', 'medicos'];
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
        subirPorTipo(tipo, id, nombreArchivo, res);

    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al subir archivo',
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
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioActualizado,
                    pathViejo
                });
            });
        });
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al subir archivo',
                    errors: err
                });
            }

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El médico con el id ' + id + ' no existe.',
                    errors: { message: 'No existe un médico con ese ID' }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // Verificamos que no venga null
            if (medico.img) {
                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del médico actualizado',
                    medico: medicoActualizado
                });
            });
        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al subir archivo',
                    errors: err
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe.',
                    errors: { message: 'No existe un hospital con ese ID' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Verificamos que no venga null
            if (usuario.img) {
                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del hospital actualizado',
                    hospital: hospitalActualizado
                });
            });
        });
    }

}

module.exports = app;