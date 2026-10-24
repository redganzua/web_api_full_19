import { useContext } from 'react'
import ImagePopup from '../Main/popup/ImagePopup';
import CurrentUserContext from '../../contexts/CurrentUserContext';

const Card = ({ card, onCardLike, onCardDelete, handleOpenPopup }) => {
    const { name, link, likes = [], owner } = card;
    const currentUser = useContext(CurrentUserContext);

  
    const isOwn = owner === currentUser?._id;

    // El backend devuelve un arreglo de ids en 'likes' (no una propiedad isLiked)
    const isLiked = likes.includes(currentUser?._id);

  
    const cardLikeButtonClassName = `place__like-btn ${
      isLiked ? 'place__like-btn_active' : ''
    }`;

    
    const imageComponent = {
      title: name,
      children__form_content: <ImagePopup card={card} />,
      isImage: true
    };

    function handleLikeClick() {
      onCardLike(card);
    }

    function handleDeleteClick() {
      onCardDelete(card);
    }

  return (
    <li className="place__card">
      <img
        className="place__image"
        src={link}
        alt={name}
        onClick={() => handleOpenPopup(imageComponent)}
      />
      {isOwn && (
        <button
          aria-label="Delete card"
          className="place__delete-btn"
          type="button"
          onClick={handleDeleteClick}
        />
      )}
      <div className="place__card-info">
        <h2 className="place__title">{name}</h2>
        <button
          aria-label="Like card"
          type="button"
          className={cardLikeButtonClassName}
          onClick={handleLikeClick}
        />
      </div>
    </li>
  )
}

export default Card
