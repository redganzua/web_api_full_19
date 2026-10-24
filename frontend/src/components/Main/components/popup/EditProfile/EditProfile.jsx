import { useState, useContext } from 'react'
import CurrentUserContext from '../../../../../contexts/CurrentUserContext';

const EditProfile = ({ onClose, onSubmit }) => {

  const currentUser = useContext(CurrentUserContext);

  // Estados controlados para cada input, inicializados con los datos actuales del usuario
  const [name, setName] = useState(currentUser?.name || '');
  const [about, setAbout] = useState(currentUser?.about || '');

  // Estados para mensajes de error de validación
  const [nameError, setNameError] = useState('');
  const [aboutError, setAboutError] = useState('');

  // Estado de carga y de error del envío a la API
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError(e.target.validationMessage);
  };

  const handleAboutChange = (e) => {
    setAbout(e.target.value);
    setAboutError(e.target.validationMessage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!onSubmit) return;

    setIsLoading(true);
    setSubmitError('');

    onSubmit({ name, about })
      .then(() => {
        onClose(); // Solo cerramos el popup si la petición tuvo éxito
      })
      .catch((err) => {
        setSubmitError('No se pudo guardar el perfil. Inténtalo de nuevo.');
        console.error(`Error al actualizar el perfil: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className="popup__form" onSubmit={handleSubmit}>
        <input
            type="text"
            name="Nombre"
            id="profile-name"
            placeholder="Nombre"
            className="popup__name popup__input"
            minLength="2"
            maxLength="40"
            required
            value={name}
            onChange={handleNameChange}
            disabled={isLoading}
        />
        <span className="form_del_perfil-input-error form__input-error">{nameError}</span>

        <input
            type="text"
            name="Acerca"
            id="profile-about"
            placeholder="Acerca de mi"
            className="popup__about popup__input"
            minLength="2"
            maxLength="200"
            required
            value={about}
            onChange={handleAboutChange}
            disabled={isLoading}
        />
        <span className="form_del_perfil-input-error form__input-error">{aboutError}</span>

        {submitError && <span className="form__input-error">{submitError}</span>}

        <button type="submit" className="popup__save-button" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
    </form>
  )
}

export default EditProfile