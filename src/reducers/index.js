// import runtime from './runtime';

import { combineReducers } from 'redux';

import articles from './articles';
import {
  USER_LOGIN, USER_LOGOUT, CHECK_AUTH, UPDATE_PROFILE,
  REQUEST_OFFERS, RECEIVE_OFFERS, CHECKED_ANSWER,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, NO_SUBMITTED, SUBMITTED_SUCCESS,
} from '../constants';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
function auth(state = {
  userLoggedIn: false,
  isFetching: false,
  isAuthenticated: !!localStorage.getItem('id_token'),
}, action) {
  switch (action.type) {
    case USER_LOGIN:
      return Object.assign({}, state, {
        userLoggedIn: true,
        user: action.user,
      });
    case USER_LOGOUT:
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        userLoggedIn: false,
        user: {},
      });
    case CHECK_AUTH:
      return Object.assign({}, state, {
        userLoggedIn: action.isUserLoggedIn,
        user: action.profile,
      });
    case UPDATE_PROFILE:
      return Object.assign({}, state, {
        userLoggedIn: true,
        user: action.profile,
      });
    default:
      return state;
  }
}

function answer(state = {
  money: '',
  term: '',
  hasAnswered: false,
},
  action) {
  switch (action.type) {
    case CHECKED_ANSWER:
      return Object.assign({}, state, {
        money: action.info.money,
        term: action.info.term,
        hasAnswered: true,
      });
    case SUBMITTED_SUCCESS:
      return Object.assign({}, state, {
        money: action.postData.money,
        term: action.postData.term,
        hasAnswered: true,
      });
    case NO_SUBMITTED:
    default:
      return state;
  }
}

function offers(state = {
  isFetching: false,
  items: [],
}, action) {
  switch (action.type) {
    case REQUEST_OFFERS:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_OFFERS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.offers,
        lastUpdated: action.receivedAt,
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  auth,
  offers,
  articles,
  answer,
});

export default rootReducer;
