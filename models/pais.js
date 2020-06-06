var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var paisSchema = new Schema({

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
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, { collection: 'paises' });

module.exports = mongoose.model('Pais', paisSchema);