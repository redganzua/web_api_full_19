const express = require('express');
const { 
    getAllUsers, getUser, getCurrentUser, updateUserProfile, updateUserAvatar, 
} = require('../controllers/users');

const { validateId, validateProfile, validateAvatar } = require('../middlewares/validation');

const router = express.Router();

// Enviamos la lista entera de usuarios
router.get('/', getAllUsers);

// Enviamos la información del usuario actual (debe ir antes de '/:id')
router.get('/me', getCurrentUser);

// Enviar un usuario según su :_id
router.get('/:id', validateId, getUser);

// Actualizamos el 'name' y 'about' del User
router.patch('/me', validateProfile, updateUserProfile);

// Actualizamos el 'avatar' del usuario
router.patch('/me/avatar', validateAvatar, updateUserAvatar);

module.exports = router;
