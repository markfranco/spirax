// import { combineReducers } from 'redux';
// import user from './user';
// import runtime from './runtime';

// export default combineReducers({
//   user,
//   runtime,
// });

import { combineReducers } from 'redux';
import {
  USER_LOGIN, USER_LOGOUT, CHECK_AUTH, UPDATE_PROFILE,
  REQUEST_OFFERS, RECEIVE_OFFERS,
} from '../actions';

function auth(state = {
  userLoggedIn: false,
}, action) {
  switch (action.type) {
    case USER_LOGIN:
      return Object.assign({}, state, {
        userLoggedIn: true,
        user: action.user,
      });
    case USER_LOGOUT:
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
});

export default rootReducer;
