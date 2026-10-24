

const ImagePopup = ({ card }) => {
  const { name, link } = card;

  return (
    <figure className="popup__image-container">
      <img className="popup__image" src={link} alt={name} />
      <figcaption className="popup__image-caption">{name}</figcaption>
    </figure>
  )
}

export default ImagePopup