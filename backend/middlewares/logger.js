const winston = require('winston');
const expressWinston = require('express-winston');

// Registra cada solicitud a la API en request.log (formato JSON)
const requestLogger = expressWinston.logger({
    transports: [new winston.transports.File({ filename: 'request.log' })],
    format: winston.format.json(),
    // El cuerpo de la solicitud no se guarda (contiene contraseñas) y el token tampoco
    headerBlacklist: ['authorization', 'cookie'],
});

// Registra los errores en error.log (formato JSON). Se omiten los encabezados para no guardar el token.
const errorLogger = expressWinston.errorLogger({
    transports: [new winston.transports.File({ filename: 'error.log' })],
    format: winston.format.json(),
    requestWhitelist: ['url', 'method', 'httpVersion', 'originalUrl', 'query'],
});

module.exports = { requestLogger, errorLogger };
