const Card = require('../models/cards');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

const tarjetaNoEncontrada = () => new NotFoundError('Tarjeta no encontrada.');

module.exports.getAllCards = (req, res, next) => {
    Card.find({})
    .then((allCards) => res.send({ data: allCards }))
    .catch(next);
};

module.exports.getCard = (req, res, next) => {
    Card.findById(req.params.id)
    .populate(['owner', 'likes'])
    .orFail(tarjetaNoEncontrada)
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
    const { name, link } = req.body;

    Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
    Card.findById(req.params.id)
    .orFail(tarjetaNoEncontrada)
    .then((card) => {
        // Solo el dueño puede eliminar su tarjeta
        if (card.owner.toString() !== req.user._id) {
            throw new ForbiddenError('No tienes permiso para eliminar esta tarjeta.');
        }

        return card.deleteOne().then(() => res.send({ data: card }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: req.user._id } },
        { new: true },
    )
    .orFail(tarjetaNoEncontrada)
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } },
        { new: true },
    )
    .orFail(tarjetaNoEncontrada)
    .then((card) => res.send({ data: card }))
    .catch(next);
};