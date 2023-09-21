import BACKEND_PORT from '../config';

export default class API {
  constructor () {
    this.url = `http://localhost:${BACKEND_PORT.BACKEND_PORT}`;
  }

  postAPIRequestBody (path, body) {
    return this.fetchAPI('POST', path, body);
  }

  postAPIRequestToken (path, token) {
    return this.fetchAPI('POST', path, null, token);
  }

  postAPIRequestBodyToken (path, body, token) {
    return this.fetchAPI('POST', path, body, token);
  }

  putAPIRequestTokenQuery (path, query, token) {
    return this.fetchAPI('PUT', path, null, token, query);
  }

  putAPIRequestTokenBodyQuery (path, query, body, token) {
    return this.fetchAPI('PUT', path, body, token, query);
  }

  putAPIRequestTokenBody (path, body, token) {
    return this.fetchAPI('PUT', path, body, token);
  }

  putAPIRequestBody (path, body) {
    return this.fetchAPI('PUT', path, body);
  }

  deleteAPIRequestToken (path, token) {
    return this.fetchAPI('DELETE', path, null, token);
  }

  getAPIRequestToken (path, token) {
    return this.fetchAPI('GET', path, null, token);
  }

  getAPIRequest (path) {
    return this.fetchAPI('GET', path);
  }

  getAPIRequestTokenQuery (path, query, token) {
    return this.fetchAPI('GET', path, null, token, query);
  }

  fetchAPI (method, path, body = null, token = null, query = null) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const url = query
      ? `${this.url}/${path}/?` + new URLSearchParams(query)
      : `${this.url}/${path}`;

    return fetch(url, options);
  }
}
