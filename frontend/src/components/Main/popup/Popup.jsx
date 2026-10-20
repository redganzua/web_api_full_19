import React from 'react'

const Popup = ({ onClose, title, children__form_content, isImage }) => {
  return (
    <div className="popup popup_show" onClick={onClose}>
      <div
        className={`popup__content ${isImage ? 'popup__content_type_image' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {!isImage && (
          <div className="popup__header">
            <h2 className="popup__content-title">{title}</h2>
          </div>
        )}
        <button className="popup__close-button" onClick={onClose}>
          <img
            className="popup__close-button-image"
            src=".././images/Close-Icon.png"
            alt="Cerrar"
          />
        </button>
        {children__form_content}
      </div>
    </div>
  )
}

export default Popup