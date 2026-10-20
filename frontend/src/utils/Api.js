import { BASE_URL } from "./constants";

export class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
    this._token = "";
  }

  /* Guarda el token para enviarlo en el encabezado de cada solicitud */
  setToken(token) {
    this._token = token;
  }

  /* Los encabezados se arman en cada llamada para usar siempre el token actual */
  _headers() {
    return {
      authorization: `Bearer ${this._token}`,
      "Content-Type": "application/json",
    };
  }

  /* Método privado: maneja la respuesta y lanza error si no es ok.
     El backend responde { data: ... }, así que devolvemos solo el contenido de "data". */
  _checkResponse(res) {
    if (res.ok) return res.json().then((json) => json.data ?? json);
    return Promise.reject(`Error: ${res.status}`);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers(),
    }).then(this._checkResponse);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards/`, {
      headers: this._headers(),
    }).then(this._checkResponse);
  }

  updateUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers(),
      body: JSON.stringify({ name, about }),
    }).then(this._checkResponse);
  }

  updateAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers(),
      body: JSON.stringify({ avatar }),
    }).then(this._checkResponse);
  }

  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards/`, {
      method: "POST",
      headers: this._headers(),
      body: JSON.stringify({ name, link }),
    }).then(this._checkResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers(),
    }).then(this._checkResponse);
  }

  likeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers(),
    }).then(this._checkResponse);
  }

  unlikeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers(),
    }).then(this._checkResponse);
  }

  // Un solo método para poner o quitar el like según el estado actual
  changeLikeCardStatus(cardId, isLiked) {
    return isLiked ? this.likeCard(cardId) : this.unlikeCard(cardId);
  }
}

// Instancia lista para usar en toda la app.
export const api = new Api({ baseUrl: BASE_URL });
