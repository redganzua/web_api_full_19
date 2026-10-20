const express = require('express');
const { 
    getAllCards, getCard, createCard, deleteCardById, likeCard, dislikeCard, 
} = require('../controllers/cards');

const { validateId, validateCard } = require('../middlewares/validation');

const router = express.Router();

// Enviamos la lista completa de todas las tarjetas
router.get('/', getAllCards);

// Enviamos la card conforme al id solicitado
router.get('/:id', validateId, getCard);

// Creamos una nueva card
router.post('/', validateCard, createCard);

// Eliminamos una tarjeta mediante su _id
router.delete('/:id', validateId, deleteCardById);

// Actualizamos el array de likes de una tarjeta mediante su id
router.put('/:id/likes', validateId, likeCard);

// Quitamos el Schema.Types.Object.Id relacionado con 
// el array de likes de la tarjeta especificada co su respectivo id
router.delete('/:id/likes', validateId, dislikeCard);

module.exports = router;