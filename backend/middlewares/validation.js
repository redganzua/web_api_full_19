const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// validator.isURL es más estricto que el validador URI incorporado en Joi
const validateURL = (value, helpers) => {
    if (validator.isURL(value)) {
        return value;
    }
    return helpers.error('string.uri');
};

// Los _id de MongoDB son strings hexadecimales de 24 caracteres
const objectId = Joi.string().hex().length(24).required();

// POST /signup — name, about y avatar son opcionales (no llevan .required())
module.exports.validateSignup = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        avatar: Joi.string().custom(validateURL),
    }),
});

// POST /signin
module.exports.validateSignin = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
});

// Rutas con :id en los parámetros (usuarios y tarjetas)
module.exports.validateId = celebrate({
    params: Joi.object().keys({
        id: objectId,
    }),
});

// PATCH /users/me
module.exports.validateProfile = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(30),
    }),
});

// PATCH /users/me/avatar
module.exports.validateAvatar = celebrate({
    body: Joi.object().keys({
        avatar: Joi.string().required().custom(validateURL),
    }),
});

// POST /cards
module.exports.validateCard = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required().custom(validateURL),
    }),
});
