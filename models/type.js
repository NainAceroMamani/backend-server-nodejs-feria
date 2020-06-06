var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var typecSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    description: {
        type: String,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, { collection: 'types' });

module.exports = mongoose.model('Type', typecSchema);