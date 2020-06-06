var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ciudadSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    description: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    pais: {
        type: Schema.Types.ObjectId,
        ref: 'Pais',
        required: [true, 'El País es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, { collection: 'ciudades' });

module.exports = mongoose.model('Ciudad', ciudadSchema);