import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../utils/auth'
import InfoTooltip from '../InfoTooltip/InfoTooltip'

/**
 * Página de registro de usuarios.
 * Llama directamente a la API de registro (utils/auth.js) y, según el resultado,
 * muestra el InfoTooltip de éxito o error. Si el registro fue exitoso, redirige
 * a /signin al cerrar el modal.
 */
const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) return;

    setIsLoading(true);

    register(email, password)
      .then(() => {
        setIsSuccess(true);
        setIsTooltipOpen(true);
      })
      .catch((err) => {
        setIsSuccess(false);
        setIsTooltipOpen(true);
        console.error(`Error al registrar usuario: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCloseTooltip = () => {
    setIsTooltipOpen(false);
    if (isSuccess) {
      navigate('/signin');
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h2 className="auth__title">Regístrate</h2>
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

          <button type="submit" className="auth__submit-button" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Regístrate'}
          </button>
        </form>

        <p className="auth__redirect-text">
          ¿Ya eres miembro?{' '}
          <Link to="/signin" className="auth__redirect-link">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <InfoTooltip
        isOpen={isTooltipOpen}
        isSuccess={isSuccess}
        onClose={handleCloseTooltip}
      />
    </div>
  )
}

export default Register
