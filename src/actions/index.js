/*
 * action types
 */

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const CHECK_AUTH = 'CHECK_AUTH';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const REQUEST_OFFERS = 'REQUEST_OFFERS';
export const RECEIVE_OFFERS = 'RECEIVE_OFFERS';

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

export function fetchOffersIfNeeded(offers) {
  return (dispatch, getState) => {
    if (shouldFetchOffers(getState(), offers)) {
      return dispatch(fetchOffers(offers));
    }
  };
}
