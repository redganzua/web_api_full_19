// Las variables de entorno vienen del archivo .env (cargado en app.js) o del sistema.
const { NODE_ENV, JWT_SECRET } = process.env;

const isProduction = NODE_ENV === 'production';

// En producción la clave secreta es obligatoria: sin ella la app no debe arrancar
if (isProduction && !JWT_SECRET) {
    throw new Error('Falta JWT_SECRET en las variables de entorno (archivo .env del servidor).');
}

module.exports = {
    // En desarrollo se usa una clave de prueba si no hay .env; en producción nunca
    JWT_SECRET: isProduction ? JWT_SECRET : (JWT_SECRET || 'clave-super-duper-mega-secreta-de-desarrollo'),
};