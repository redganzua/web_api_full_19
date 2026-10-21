// Carga las variables del archivo .env (si no existe, no pasa nada). Debe ser lo primero.
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb');

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto: ${PORT}`);
});

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { validateSignup, validateSignin } = require('./middlewares/validation');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Permite solicitudes desde el frontend (otro origen) y responde las solicitudes preflight
app.use(cors());
app.use(express.json());

// Registro de solicitudes (debe ir antes de todas las rutas)
app.use(requestLogger);

// Ruta temporal para la revisión del código: hace caer el servidor para probar PM2. ELIMINAR después de la revisión.
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});

// Rutas públicas (no requieren autorización)
app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

// A partir de aquí, todas las rutas requieren un token válido
app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

// Cualquier ruta que no exista llega hasta aquí
app.use((req, res, next) => {
  next(new NotFoundError('Recurso solicitado no encontrado'));
});

// Registro de errores (después de las rutas y antes de los manejadores de errores)
app.use(errorLogger);

// Errores de validación de celebrate (responden 400)
app.use(errors());

// Manejo centralizado de errores (siempre al final)
app.use(errorHandler);