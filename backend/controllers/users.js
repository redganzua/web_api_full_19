const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const { JWT_SECRET } = require('../config');

module.exports.getAllUsers = (req, res, next) => {
    User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
    User.findById(req.params.id)
    .orFail(() => new NotFoundError('Usuario no encontrado.'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
    User.findById(req.user._id)
    .orFail(() => new NotFoundError('Usuario no encontrado.'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
    const {
        name, about, avatar, email, password,
    } = req.body;

    if (!email || !password) {
        return next(new BadRequestError('El email y la contraseña son obligatorios.'));
    }

    // Los campos opcionales vacíos se envían como undefined para que Mongoose aplique los valores por defecto
    return bcrypt.hash(password, 10)
    .then((hash) => User.create({
        name: name || undefined,
        about: about || undefined,
        avatar: avatar || undefined,
        email,
        password: hash,
    }))
    .then((user) => {
        // select: false solo aplica a consultas, no a User.create, así que quitamos el hash a mano
        const userSinPassword = user.toObject();
        delete userSinPassword.password;
        res.status(201).send({ data: userSinPassword });
    })
    .catch(next); // ValidationError y email duplicado (11000) los traduce el manejador central
};

module.exports.updateUserProfile = (req, res, next) => {
    const { name, about } = req.body;

    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Usuario no encontrado.'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
    const { avatar } = req.body;

    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Usuario no encontrado.'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new BadRequestError('El email y la contraseña son obligatorios.'));
    }

    // Mensaje único para no revelar si falló el correo o la contraseña
    const mensajeCredenciales = 'Correo o contraseña incorrectos.';

    return User.findOne({ email }).select('+password')
    .then((user) => {
        if (!user) throw new UnauthorizedError(mensajeCredenciales);

        return bcrypt.compare(password, user.password)
        .then((coinciden) => {
            if (!coinciden) throw new UnauthorizedError(mensajeCredenciales);

            const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
            res.send({ token });
        });
    })
    .catch(next);
};
