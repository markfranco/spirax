import { EventEmitter } from 'events';
import Auth0Lock from 'auth0-lock';
import axios from 'axios';

import { isTokenExpired } from './jwtHelper';

// import { browserHistory } from 'react-router';

export default class AuthService extends EventEmitter {
  constructor(clientId = 'PZRNubBes13c3ZlKIt700T7Cn2zdsHM7', domain = 'markfranco.au.auth0.com') {
    super();
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: 'http://localhost:3000/',
        // redirectUrl: 'http://aws-website-seedinvest-7elpz.s3-website-us-east-1.amazonaws.com/',
        responseType: 'token',
        scope: 'app_metadata',
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
    // });

    axios.post('https://markfranco.au.auth0.com/delegation', {
      id_token: authResult.idToken,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      api: 'firebase',
      scope: 'openid name email displayName app_metadata',
      target: 'PZRNubBes13c3ZlKIt700T7Cn2zdsHM7',
      client_id: 'PZRNubBes13c3ZlKIt700T7Cn2zdsHM7',
    })
    .then((response) => {
      window.firebase.auth()
        .signInWithCustomToken(response.data.id_token)
        .catch((error) => {
          console.error(error);
        });
      console.log('This worked, response is', response);
    })
    .catch(error => console.error(error));

    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.error('Error loading the Profile', error);
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
