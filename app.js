//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// CORDS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar Rutas
var usuarioRoutes = require('./routes/usuario');
var typeRoutes = require('./routes/type');
var paisRoutes = require('./routes/pais');
var loginRoutes = require('./routes/login');
var ciudadRoutes = require('./routes/ciudad');
var uploadRoutes = require('./routes/upload');
var appRoutes = require('./routes/app');
var imagenesRoutes = require('./routes/imagenes');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/Ciis2020', (err, res) => {

    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')

});
// Rutas
app.use('/type', typeRoutes);
app.use('/pais', paisRoutes);
app.use('/login', loginRoutes);
app.use('/ciudad', ciudadRoutes);
app.use('/upload', uploadRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);

//Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Ciis server puerto 3000: \x1b[32m%s\x1b[0m', 'online ')
});