var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

/**
 * Busqueda por collection
 */
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i'); // espresión Regular => i -> mayúsculas y minúsculas

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: true,
                mensaje: 'Los tipos sósolo son: usuarios, médicos y hospitales',
                error: { message: 'Tipo de tabla/colección no válido' }
            });
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data // [] => mostrar el valor 
        });
    });
});

/**
 * Búsqueda en todas las tablas 
 */

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i'); // espresión Regular => i -> mayúsculas y minúsculas

    // Promesas en forma paralela
    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then(respuestas => {

        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });
});

/**
 * Funtion Hospitales
 */

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar Hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

/**
 * Funtion Médicos
 */

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar Hospitales', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

/**
 * Funtion Usuarios , buscar en dos campos
 */

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;