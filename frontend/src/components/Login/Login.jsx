import React, { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * Página de inicio de sesión.
 * Props:
 * - onLogin: function(email, password) => Promise — ejecuta la autorización en App.jsx.
 */
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) return;

    setIsLoading(true);
    setSubmitError('');

    onLogin(email, password).catch((err) => {
      setSubmitError('Correo o contraseña incorrectos.');
      console.error(`Error al iniciar sesión: ${err}`);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h2 className="auth__title">Iniciar sesión</h2>
        <form className="auth__form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="auth__input"
            required
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="auth__input"
            required
            minLength="8"
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
          />

          {submitError && <span className="auth__error">{submitError}</span>}

          <button type="submit" className="auth__submit-button" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth__redirect-text">
          ¿Aún no eres miembro?{' '}
          <Link to="/signup" className="auth__redirect-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
