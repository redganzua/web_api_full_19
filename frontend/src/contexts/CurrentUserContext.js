import { createContext } from "react";

// Contexto que da acceso a los datos del usuario actual
// en cualquier componente de la aplicación, sin pasar props manualmente.
const CurrentUserContext = createContext(null);

export default CurrentUserContext;