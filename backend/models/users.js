const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: 'Jacques Cousteau',
    },
    about: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: 'Explorador',
    },
    avatar: {
        type: String,
        default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
        validate: {
            validator(v) {
                // Validamos la variable avatar con la expresión regular y un '.test(variable_avatar)' al final
                return /^https?:\/\/(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[a-zA-Z0-9._~:/?%#@!$&'()*+,;=-]*)*$/.test(v);
            },
            message: (props) => `${props.value} no es una URL válida para usarse como Avatar.`,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator(v) {
                return validator.isEmail(v);
            },
            message: (props) => `${props.value} no es un email válido.`,
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});

module.exports = mongoose.model('user', userSchema);
