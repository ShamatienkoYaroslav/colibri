import { Auth } from '../utils';

import {
  USER_LOGIN,
  USER_LOGIN_ERROR,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_LOGOUT_ERROR,
  USER_LOGOUT_SUCCESS,
  FETCH_USERS,
  FETCH_USERS_ERROR,
  FETCH_USERS_SUCCESS,
} from '../actions/users';

const initialState = {
  user: Auth.getUser(),
  data: [],
  e: null,
  loggedIn: Auth.tokenIsSet(),
  isFetched: false,
};

export default (state = initialState, action) => {
  switch (action.type) {

    // LOGIN
    case USER_LOGIN:
      return state;
    case USER_LOGIN_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
        user: null,
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user,
        loggedIn: action.loggedIn,
        e: null,
      };

    // LOGOUT
    case USER_LOGOUT:
      return state;
    case USER_LOGOUT_ERROR:
      return {
        ...state,
        e: action.e,
      };
    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        loggedIn: action.loggedIn,
      };

    // ALL
    case FETCH_USERS:
      return {
        ...state,
      };
    case FETCH_USERS_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetched: true,
      };

    default:
      return state;
  }
};
