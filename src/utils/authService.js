import { EventEmitter } from 'events';
// import Auth0Lock from 'auth0-lock';
import axios from 'axios';

import { isTokenExpired } from './jwtHelper';
import * as actions from '../actions';

export default class AuthService extends EventEmitter {
  doAuthentication(authResult, store) {
    const { dispatch } = store;

    // Saves the user token
    this.setToken(authResult.idToken);

    axios.post('https://markfranco.au.auth0.com/delegation', {
      id_token: authResult.idToken,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      api: 'firebase',
      scope: 'openid name email displayName app_metadata',
      target: 'PZRNubBes13c3ZlKIt700T7Cn2zdsHM7',
      client_id: 'PZRNubBes13c3ZlKIt700T7Cn2zdsHM7',
    })
    .then((response) => {
      localStorage.setItem('firebase_id_token', response.data.id_token);
      window.firebase.auth()
        .signInWithCustomToken(response.data.id_token)
        .catch((error) => {
          console.error(error);
        });
    })
    .catch(error => console.error(error));

    actions.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.error('Error loading the Profile', error);
      } else {
        this.setProfile(profile, dispatch);
      }
    });
  }

  setProfile(profile, dispatch) {
    localStorage.setItem('profile', JSON.stringify(profile));
    this.emit('profile_updated', profile);
    dispatch(actions.checkAuth(this.loggedIn(), profile));
  }

  getProfile() { // eslint-disable-line
    // Retrieves the profile data from local storage
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }

  login() {
    actions.lock.show();
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !isTokenExpired(token);
  }

  setToken(idToken) { // eslint-disable-line
    localStorage.setItem('id_token', idToken);
  }

  getToken() { // eslint-disable-line 
    // Retrieves the user token from local storage
    return localStorage.getItem('id_token');
  }

  logout() { // eslint-disable-line
    // Clear user token and profile data from local storage
    localStorage.removeItem('id_token');
    localStorage.removeItem('firebase_id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('access_token');
  }
}
