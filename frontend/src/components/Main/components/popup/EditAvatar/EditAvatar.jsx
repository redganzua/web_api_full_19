import React, { useState } from 'react'

const EditAvatar = ({ onClose, onSubmit }) => {

  // Estado controlado para el input
  const [avatarLink, setAvatarLink] = useState('');

  // Estado para el mensaje de error de validación
  const [avatarError, setAvatarError] = useState('');

  // Estado de carga y de error del envío a la API
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleAvatarChange = (e) => {
    setAvatarLink(e.target.value);
    setAvatarError(e.target.validationMessage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!onSubmit) return;

    setIsLoading(true);
    setSubmitError('');

    onSubmit({ avatar: avatarLink })
      .then(() => {
        setAvatarLink(''); // Limpiar el formulario solo si se guardó bien
        onClose();
      })
      .catch((err) => {
        setSubmitError('No se pudo guardar el avatar. Inténtalo de nuevo.');
        console.error(`Error al actualizar el avatar: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className="popup__form popup__form_avatar" onSubmit={handleSubmit}>
      <input
        type="url"
        name="avatar"
        id="form_de_avatar"
        placeholder="Enlace de la imagen"
        className="popup__input"
        required
        value={avatarLink}
        onChange={handleAvatarChange}
        disabled={isLoading}
      />
      <span className="form_de_avatar-input-error form__input-error">{avatarError}</span>

      {submitError && <span className="form__input-error">{submitError}</span>}

      <button type="submit" className="popup__save-button" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}

export default EditAvatar