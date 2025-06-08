class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  getAppInfo() {
    return Promise.all([
      this.getUserInfo(),      
      this.getInitialCards()   
    ]);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    }).then(this._handleResponse);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    }).then(this._handleResponse);
  }

  editUserInfo({ name, about }) {
  return fetch(`${this._baseUrl}/users/me`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({
      name,
      about
    })
  }).then(this._handleResponse);
}

editUserAvatar({ avatar }) {
  return fetch(`${this._baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({ avatar })
  }).then(this._handleResponse);
}

removeCard(cardId) {
  return fetch(`${this._baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: this._headers
  }).then(this._handleResponse);
}

likeCard(cardId) {
  return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
    method: "PUT",
    headers: this._headers
  }).then(this._handleResponse);
}

unlikeCard(cardId) {
  return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
    method: "DELETE",
    headers: this._headers
  }).then(this._handleResponse);
}

addCard({ name, link }) {
  return fetch(`${this._baseUrl}/cards`, {
    method: "POST",
    headers: this._headers,
    body: JSON.stringify({ name, link })
  }).then(this._handleResponse);
}


  _handleResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }
}

export default Api;

