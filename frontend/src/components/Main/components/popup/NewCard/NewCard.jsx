import { useState } from 'react'

const NewCard = ({ onClose, onSubmit }) => {

  // Estados controlados para cada input
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  // Estados para mensajes de error de validación
  const [nameError, setNameError] = useState('');
  const [linkError, setLinkError] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError(e.target.validationMessage);
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
    setLinkError(e.target.validationMessage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit({ name, link });
    }

    // Limpiar el formulario para la próxima vez que se abra
    setName('');
    setLink('');

    onClose();
  };

  return (
    <form className="popup__form popup__form_add-card" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        id="form_de_lugar-title"
        placeholder="Título"
        className="popup__input"
        minLength="2"
        maxLength="30"
        required
        value={name}
        onChange={handleNameChange}
      />
      <span className="form_de_lugar-input-error form__input-error">{nameError}</span>

      <input
        type="url"
        name="link"
        id="form_de_lugar-url"
        placeholder="Imagen URL"
        className="popup__input"
        required
        value={link}
        onChange={handleLinkChange}
      />
      <span className="form_de_lugar-input-error form__input-error">{linkError}</span>

      <button type="submit" className="popup__save-button">Guardar</button>
    </form>
  )
}

export default NewCard