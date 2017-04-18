import { EventEmitter } from 'events';
import Auth0Lock from 'auth0-lock';

import { isTokenExpired } from './jwtHelper';

// import { browserHistory } from 'react-router';

export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super();
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: 'http://localhost:3000/',
        responseType: 'token',
      },
    });

    this.lock.on('authenticated', this.doAuthentication.bind(this));
    this.login = this.login.bind(this);
  }

  doAuthentication(authResult) {
    // Saves the user token
    this.setToken(authResult.idToken);
    // navigate to the home route
    // browserHistory.replace('/home');

    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error);
      } else {
        this.setProfile(profile);
      }
    });
  }

  setProfile(profile) {
    // Saves profile data to local storage
    localStorage.setItem('profile', JSON.stringify(profile));
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile);
  }

  getProfile() { // eslint-disable-line
    // Retrieves the profile data from local storage
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !isTokenExpired(token);
  }

  setToken(idToken) { // eslint-disable-line
    // Saves user token to local storage
    localStorage.setItem('id_token', idToken);
  }

  getToken() { // eslint-disable-line 
    // Retrieves the user token from local storage
    return localStorage.getItem('id_token');
  }

  logout() { // eslint-disable-line
    // Clear user token and profile data from local storage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }
}
