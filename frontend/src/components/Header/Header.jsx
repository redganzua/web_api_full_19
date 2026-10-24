import { Link, useLocation } from 'react-router-dom'

/**
 * Encabezado de la aplicación. Su contenido varía según el estado de sesión:
 * - Autorizado: logo + correo del usuario + botón "Cerrar sesión".
 * - No autorizado: logo + enlace a /signup o /signin según la ruta actual.
 */
const Header = ({ loggedIn, userEmail, onLogout }) => {
  const location = useLocation();

  return (
    <header className="header">
      <img
        className="header__logo"
        src=".././images/header_logo.png"
        alt="Logo principal que dice Around the U.S"
      />

      {loggedIn ? (
        <div className="header__user-info">
          <p className="header__email">{userEmail}</p>
          <button className="header__logout-button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      ) : (
        <>
          {location.pathname === '/signin' && (
            <Link to="/signup" className="header__nav-link">
              Regístrate
            </Link>
          )}
          {location.pathname === '/signup' && (
            <Link to="/signin" className="header__nav-link">
              Iniciar sesión
            </Link>
          )}
        </>
      )}
    </header>
  )
}

export default Header
