var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    sur_name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El contraseña es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos,
        required: [true, 'El role es necesario']
    },
    google: {
        type: Boolean,
        default: false
    }

}, { collection: 'usuarios' });

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' })

module.exports = mongoose.model('Usuario', usuarioSchema);