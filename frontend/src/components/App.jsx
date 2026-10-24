import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import '../index.css'

//Importar componentes de la página
import Header from './Header/Header'
import Main from './Main/Main'
import Footer from './Footer/Footer'
import Login from './Login/Login'
import Register from './Register/Register'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute'

//Importar API y contexto de usuario actual
import { api } from '../utils/Api'
import { authorize, checkToken } from '../utils/auth'
import CurrentUserContext from '../contexts/CurrentUserContext'

function App() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  //Estado de autenticación
  //El token se guarda en el estado y también en localStorage para sobrevivir a recargas
  const [token, setToken] = useState(() => localStorage.getItem('jwt') || '');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  //Evita parpadeos de redirección mientras se valida el token guardado
  //Si no hay token guardado, no hay nada que validar, así que arranca en false
  const [isCheckingToken, setIsCheckingToken] = useState(Boolean(token));

  //Guarda o borra el token en el estado, en localStorage y en la instancia de la API
  const saveToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem('jwt', newToken);
    } else {
      localStorage.removeItem('jwt');
    }
    api.setToken(newToken);
    setToken(newToken);
  }, []);

  //Al montar la app, valida si hay un token guardado en localStorage
  useEffect(() => {
    if (!token) return;

    //La API necesita el token antes de que los componentes hijos hagan solicitudes
    api.setToken(token);

    checkToken(token)
      .then((res) => {
        setLoggedIn(true);
        setUserEmail(res.data.email);
        navigate('/', { replace: true });
      })
      .catch((err) => {
        console.error(`Token inválido o expirado: ${err}`);
        saveToken('');
      })
      .finally(() => {
        setIsCheckingToken(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Carga los datos del usuario actual solo cuando ya está autorizado
  useEffect(() => {
    if (!loggedIn) return;

    api
      .getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.error(`Error al cargar el usuario actual: ${err}`);
      });
  }, [loggedIn]);

  //Inicia sesión: autoriza contra la API, guarda el token y redirige a "/"
  const handleLogin = useCallback((email, password) => {
    return authorize(email, password).then((data) => {
      saveToken(data.token);
      setLoggedIn(true);
      setUserEmail(email);
      navigate('/', { replace: true });
    });
  }, [navigate, saveToken]);

  //Cierra sesión: limpia el token y el estado, y redirige a /signin
  const handleLogout = useCallback(() => {
    saveToken('');
    setLoggedIn(false);
    setUserEmail('');
    setCurrentUser(null);
    navigate('/signin', { replace: true });
  }, [navigate, saveToken]);

  //Actualiza el perfil (nombre y about) en el backend y refresca currentUser
  function handleUpdateUser(newData) {
    return api.updateUserInfo(newData).then((updatedUser) => {
      setCurrentUser(updatedUser);
    });
  }

  //Actualiza el avatar en el backend y refresca currentUser
  function handleUpdateAvatar(newData) {
    return api.updateAvatar(newData).then((updatedUser) => {
      setCurrentUser(updatedUser);
    });
  }

  //Mientras se valida el token guardado, no renderizamos rutas todavía
  if (isCheckingToken) {
    return null;
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header loggedIn={loggedIn} userEmail={userEmail} onLogout={handleLogout} />

        <Routes>
          <Route
            path="/signup"
            element={loggedIn ? <Navigate to="/" replace /> : <Register />}
          />
          <Route
            path="/signin"
            element={
              loggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <>
                  <Main onUpdateUser={handleUpdateUser} onUpdateAvatar={handleUpdateAvatar} />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          {/* Cualquier otra ruta redirige según el estado de autenticación */}
          <Route
            path="*"
            element={<Navigate to={loggedIn ? '/' : '/signin'} replace />}
          />
        </Routes>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
