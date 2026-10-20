import React from 'react'

/**
 * Modal que informa el resultado del registro (éxito o error).
 * Reutiliza el marcado y las clases de popup.css para mantener consistencia visual.
 *
 * Props:
 * - isOpen: boolean — controla si el modal se muestra.
 * - isSuccess: boolean — determina el ícono y el mensaje mostrados.
 * - onClose: function — cierra el modal (click en overlay o botón de cerrar).
 */
const InfoTooltip = ({ isOpen, isSuccess, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup popup_show" onClick={onClose}>
      <div
        className="popup__content popup__content_type_info-tooltip"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="popup__close-button" onClick={onClose}>
          <img
            className="popup__close-button-image"
            src=".././images/Close-Icon.png"
            alt="Cerrar"
          />
        </button>

        {isSuccess ? (
          <svg
            className="popup__info-tooltip-icon"
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="58" fill="none" stroke="#4CD964" strokeWidth="4" />
            <path
              d="M35 62l17 17 33-33"
              fill="none"
              stroke="#4CD964"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className="popup__info-tooltip-icon"
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="58" fill="none" stroke="#FF3B30" strokeWidth="4" />
            <path
              d="M40 40l40 40M80 40l-40 40"
              fill="none"
              stroke="#FF3B30"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        )}

        <p className="popup__info-tooltip-text">
          {isSuccess
            ? '¡Correcto! Ya estás registrado.'
            : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.'}
        </p>
      </div>
    </div>
  )
}

export default InfoTooltip
