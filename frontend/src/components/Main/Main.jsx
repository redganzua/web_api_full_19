import { useState, useEffect, useContext } from 'react'
import Popup from './popup/Popup';
import NewCard from './components/popup/NewCard/NewCard';
import EditProfile from './components/popup/EditProfile/EditProfile';
import EditAvatar from './components/popup/EditAvatar/EditAvatar';
import ConfirmDeleteForm from './popup/ConfirmDeleteForm';
import Card from '../Card/Card';
import { api } from '../../utils/Api';
import CurrentUserContext from '../../contexts/CurrentUserContext';

const Main = ({ onUpdateUser, onUpdateAvatar }) => {

    //Usuario actual, obtenido del contexto
    const currentUser = useContext(CurrentUserContext);

    //Hook para popups
    const [activePopup, setActivePopup] = useState(null);

    //Funciones para abrir y cerrar Popups
    function handleOpenPopup(popup){
      setActivePopup(popup);
    }
    function handleClosePopup(){
      setActivePopup(null);
    }

    //Props de popups especificos
    const editProfilePopup = {
      title: "Editar Perfil",
      children__form_content: (
        <EditProfile
          onClose={handleClosePopup}
          onSubmit={onUpdateUser}
        />
      )
    };

    //Esatdo para las Cards
    const [cards, setCards] = useState([]);

    //Al montar el componente, se piden las tarjetas iniciales al backend
    useEffect(() => {
      api
        .getInitialCards()
        .then((cardsData) => {
          setCards(cardsData);
        })
        .catch((err) => {
          console.error(`Error al cargar las tarjetas: ${err}`);
        });
    }, []);

    //Añadir una tarjeta nueva (llamado desde NewCardForm)
    const handleAddCard = (newCardData) => {
      api
        .addCard(newCardData)
        .then((newCard) => {
          setCards((prevCards) => [newCard, ...prevCards]);
          handleClosePopup();
        })
        .catch((err) => {
          console.error(`Error al añadir la tarjeta: ${err}`);
        });
    };

    //Dar o quitar like a una tarjeta
    async function handleCardLike(card) {
      // Verifica una vez más si a esta tarjeta ya le has dado like
      const isLiked = (card.likes || []).includes(currentUser?._id);

      // Envía una solicitud a la API y obtén los datos actualizados de la tarjeta
      await api
        .changeLikeCardStatus(card._id, !isLiked)
        .then((newCard) => {
          setCards((state) =>
            state.map((currentCard) => (currentCard._id === card._id ? newCard : currentCard))
          );
        })
        .catch((error) => console.error(error));
    }

    //Tarjeta seleccionada para borrar (se usa en el popup de confirmación)
    const [cardToDelete, setCardToDelete] = useState(null);

    //Clic en la papelera: guarda la tarjeta a borrar (esto abre el popup)
    function handleCardDelete(card) {
      setCardToDelete(card);
    }

    //Cierra el popup de confirmación de borrado
    function handleCloseConfirm() {
      setCardToDelete(null);
    }

    //Confirmación real del borrado (llamado desde ConfirmDeleteForm)
    //Devuelve la promesa para que el formulario maneje carga/cierre.
    function handleConfirmDelete() {
      return api
        .deleteCard(cardToDelete._id)
        .then(() => {
          setCards((state) =>
            state.filter((currentCard) => currentCard._id !== cardToDelete._id)
          );
          setCardToDelete(null);
        });
    }

     const newCardPopup = {
      title: "Nuevo Lugar",
      children__form_content: (
        <NewCard onClose={handleClosePopup} onSubmit={handleAddCard} />
      )
    };

    const editAvatarPopup = {
      title: "Editar Avatar",
      children__form_content: (
        <EditAvatar onClose={handleClosePopup} onSubmit={onUpdateAvatar} />
      )
    };

  return (
    <main className="content">
        <section className="profile">
          <div className="profile__avatar-container">
            <img
              className="profile__avatar"
              src={currentUser?.avatar}
              alt="La foto de perfil elegida por el usuario"
            />
            <div className="profile__avatar-overlay" onClick={() => handleOpenPopup(editAvatarPopup)}>
              <img src="../images/Profile Edit Button.png" alt="Editar avatar"/>
            </div>
          </div>

          <div className="profile__info">
            <div>
              <h3 className="profile__info-name">{currentUser?.name}</h3>
              <p className="profile__info-about">{currentUser?.about}</p>
            </div>
            <button className="profile__edit-btn" onClick={() => handleOpenPopup(editProfilePopup)}>
              <img
                className="profile__edit-btn-image"
                src="../images/Profile Edit Button.png"
                alt="Botón para editar perfil"
              />
            </button>
          </div>
          <button className="profile__add-btn" onClick={() => handleOpenPopup(newCardPopup)}>
            <img
              className="profile__add-btn-image"
              src="../images/Add Button.png"
              alt="Botón para añadir imágenes"
            />
          </button>
        </section>
        <ul className="place">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              handleOpenPopup={handleOpenPopup}
            />
          ))}
        </ul>

        {activePopup && (
          <Popup
            title={activePopup.title}
            children__form_content={activePopup.children__form_content}
            onClose={handleClosePopup}
            isImage={activePopup.isImage}
          />
        )}

        {cardToDelete && (
          <Popup
            title="¿Estás seguro?"
            children__form_content={
              <ConfirmDeleteForm
                onClose={handleCloseConfirm}
                onSubmit={handleConfirmDelete}
              />
            }
            onClose={handleCloseConfirm}
          />
        )}

      </main>
  )
}

export default Main