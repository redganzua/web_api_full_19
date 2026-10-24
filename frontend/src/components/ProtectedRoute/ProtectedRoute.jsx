import { Navigate } from 'react-router-dom'

/**
 * Envuelve una ruta y solo la renderiza si el usuario está autorizado.
 * Si no lo está, redirige a /signin sin importar la ruta desde la que se accedió.
 *
 * Uso:
 * <Route path="/" element={
 *   <ProtectedRoute loggedIn={loggedIn}>
 *     <Main />
 *   </ProtectedRoute>
 * } />
 */
const ProtectedRoute = ({ loggedIn, children }) => {
  if (!loggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute
