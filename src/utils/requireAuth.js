import React, { Component } from 'react';
import { connect } from 'react-redux';
// A login form component or what ever you would like to fall back to if the
// the user is not authenticated
// import LoginForm from './Forms/LoginForm';

import ErrorPage from '../error';

import AuthService from '../utils/authService';

const auth = new AuthService('PZRNubBes13c3ZlKIt700T7Cn2zdsHM7', 'markfranco.au.auth0.com');

export default function (ComposedComponent) {
  class Authentication extends Component {
    render() {
      // Check your redux store for an isAuthenticated attribute
      // If is authenticated return the composed component

      if (auth.loggedIn()) {
        return <ComposedComponent {...this.props} />;
      }
      return <ErrorPage />;
    }
  }
  // Map state to props
  function mapStateToProps(state) {
    return { authenticationStore: state.authenticationStore };
  }
  return connect(mapStateToProps)(Authentication);
}
