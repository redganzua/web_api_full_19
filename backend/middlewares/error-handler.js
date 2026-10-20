// Traduce cualquier error recibido por next(err) en una respuesta HTTP.
// Nunca se envía el objeto error original al cliente.
const resolveError = (err) => {
    // Errores propios (BadRequestError, NotFoundError, etc.) y errores HTTP de Express (ej. JSON mal formado)
    if (err.statusCode && err.statusCode < 500) {
        return { statusCode: err.statusCode, message: err.message };
    }
    // Errores de Mongoose
    if (err.name === 'ValidationError') {
        return { statusCode: 400, message: err.message };
    }
    if (err.name === 'CastError') {
        return { statusCode: 400, message: 'El identificador o los datos enviados no son válidos.' };
    }
    if (err.code === 11000) {
        return { statusCode: 409, message: 'Ya existe un usuario con ese email.' };
    }
    // Cualquier error imprevisto
    return { statusCode: 500, message: 'Se ha producido un error en el servidor.' };
};

// Los middlewares de error necesitan los 4 parámetros, aunque 'next' no se use
module.exports = (err, req, res, next) => {
    const { statusCode, message } = resolveError(err);

    if (statusCode === 500) {
        console.error(err);
    }

    res.status(statusCode).send({ message });
};