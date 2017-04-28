import { REQUEST_ARTICLES, RECEIVE_ARTICLES } from '../constants';

// import constants

export default function articles(state = {
  isFetching: false, // this stays
  items: [],
  // users answer { how much, maybe percentage }
}, action) {
  switch (action.type) {
    case REQUEST_ARTICLES:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_ARTICLES:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.articles,
        lastUpdated: action.receivedAt,
      });
    default:
      return state;
  }
}

// POST QUESTION

// RETRIEVE QUESTION
