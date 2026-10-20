// src/utils/auth.js
// Funciones y solicitudes a la API relacionadas con el registro y la autorización de usuarios.

import { BASE_URL } from "./constants";

/* Método auxiliar: maneja la respuesta y lanza error si no es ok */
function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

/**
 * Registra un nuevo usuario.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{data: {_id: string, email: string}}>}
 */
export function register(email, password) {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
}

/**
 * Autoriza a un usuario ya registrado.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string}>}
 */
export function authorize(email, password) {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
}

/**
 * Verifica la validez de un token y devuelve los datos del usuario.
 * @param {string} token
 * @returns {Promise<{data: {_id: string, email: string}}>}
 */
export function checkToken(token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);
}
