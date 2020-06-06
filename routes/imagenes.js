var express = require('express');

var app = express();

var path = require('path'); // nativa de node

// Middeleware
var mAutenticationUser = require('../middlewares/autenticationUser');
var fs = require('fs');

app.get('/:tipo/:img', mAutenticationUser.verificaToken, (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var tipoValidos = ['usuarios', 'paises', 'ciudades'];
    if (tipoValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida.',
            errors: { message: 'Tipo de colección no es válida.' }
        });
    }

    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});

module.exports = app;