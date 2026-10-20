// Clave para firmar y verificar los JWT. En producción debe venir de la variable de entorno JWT_SECRET.
const { JWT_SECRET = 'clave-super-duper-mega-secreta-de-desarrollo' } = process.env;

module.exports = { JWT_SECRET };