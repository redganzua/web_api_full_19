import React, { useState } from 'react'

const ConfirmDeleteForm = ({ onClose, onSubmit }) => {

  // Estado de carga y de error del envío a la API
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!onSubmit) return;

    setIsLoading(true);
    setSubmitError('');

    onSubmit()
      .then(() => {
        onClose(); // Solo cerramos el popup si el borrado tuvo éxito
      })
      .catch((err) => {
        setSubmitError('No se pudo eliminar la tarjeta. Inténtalo de nuevo.');
        console.error(`Error al eliminar la tarjeta: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className="popup__form popup__form_confirm" onSubmit={handleSubmit}>
      {submitError && <span className="form__input-error">{submitError}</span>}

      <button type="submit" className="popup__save-button" disabled={isLoading}>
        {isLoading ? 'Eliminando...' : 'Sí'}
      </button>
    </form>
  )
}

export default ConfirmDeleteForm
