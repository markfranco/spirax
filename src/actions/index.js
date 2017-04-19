/*
 * action types
 */

import {
  USER_LOGIN, USER_LOGOUT, CHECK_AUTH, RECEIVE_ARTICLES,
  UPDATE_PROFILE, REQUEST_OFFERS, RECEIVE_OFFERS, REQUEST_ARTICLES } from '../constants';

/*
 * action creators
 */

export function userLogin(user) {
  return { type: USER_LOGIN, user };
}

export function userLogout() {
  return { type: USER_LOGOUT };
}

export function checkAuth(isUserLoggedIn, profile) {
  return (dispatch) => {
    dispatch({ type: CHECK_AUTH, isUserLoggedIn, profile });

    if (isUserLoggedIn) {
      dispatch(userLogin(profile));
    }
  };
}

export function updateProfile(profile) {
  return { type: UPDATE_PROFILE, profile };
}

function requestOffers(offers) {
  return {
    type: REQUEST_OFFERS,
    offers,
  };
}

export function receiveOffers(offers) {
  return {
    type: RECEIVE_OFFERS,
    offers,
    receivedAt: Date.now(),
  };
}

export function requestArticles(articles) {
  return {
    type: REQUEST_ARTICLES,
    articles,
  };
}

export function receiveArticles(articles) {
  return {
    type: RECEIVE_ARTICLES,
    articles,
    receivedAt: Date.now(),
  };
}

export function fetchArticles() {
  return (dispatch) => {
    dispatch(requestArticles());
    return fetch('https://gist.githubusercontent.com/koistya/a32919e847531320675764e7308b796a/raw/articles.json')
      .then(response => response.json())
      .then(articles => dispatch(receiveArticles(articles),
        error => console.error('error', error),
      ));
  };
}


function fetchOffers() {
  return (dispatch) => {
    dispatch(requestOffers());
    return fetch('http://localhost:3004/offers')
      .then(response => response.json())
      .then(offers => dispatch(receiveOffers(offers),
        error => console.error('error', error),
      ));
  };
}

function shouldFetchOffers(state, offers) {
  return (dispatch) => {
    const stateOffers = state.offers;
    if (offers === undefined || stateOffers.items.length !== offers.items.length) {
      return dispatch(fetchOffers());
    }
    if (!offers) {
      return true;
    } else if (offers.isFetching) {
      return false;
    } else {
      return false;
    }
  };
}

function shouldFetchArticles(state, articles) {
  return (dispatch) => {
    const stateOffers = state.articles;
    if (articles === undefined || stateOffers.items.length !== articles.items.length) {
      return dispatch(fetchOffers());
    }
    if (!articles) {
      return true;
    } else if (articles.isFetching) {
      return false;
    } else {
      return false;
    }
  };
}

export function fetchArticlesIfNeeded(articles) {
  return (dispatch, getState) => {
    if (shouldFetchArticles(getState(), articles)) {
      return dispatch(fetchArticles(articles));
    }
  };
}

export function fetchOffersIfNeeded(offers) {
  return (dispatch, getState) => {
    if (shouldFetchOffers(getState(), offers)) {
      return dispatch(fetchOffers(offers));
    }
  };
}
