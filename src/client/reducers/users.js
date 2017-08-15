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
  FETCH_USER,
  FETCH_USER_ERROR,
  FETCH_USER_SUCCESS,
  CREATE_USER,
  CREATE_USER_ERROR,
  CREATE_USER_SUCCESS,
  CHANGE_USER,
  CHANGE_USER_ERROR,
  CHANGE_USER_SUCCESS,
  DELETE_USER,
  DELETE_USER_ERROR,
  DELETE_USER_SUCCESS,
} from '../actions/users';

import { updateData } from '.';

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

    // ONE
    case FETCH_USER:
      return {
        ...state,
      };
    case FETCH_USER_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.user),
        isFetched: true,
      };

    // CREATE
    case CREATE_USER:
      return state;
    case CREATE_USER_ERROR:
      return {
        ...state,
        isFetched: true,
        e: action.e,
      };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        data: [
          ...state.data,
          action.data.user,
        ],
      };

    // CHANGE
    case CHANGE_USER:
      return {
        ...state,
      };
    case CHANGE_USER_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case CHANGE_USER_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.user),
        isFetched: true,
      };

    // DELETE
    case DELETE_USER:
      return {
        ...state,
      };
    case DELETE_USER_ERROR:
      return {
        ...state,
        e: action.e,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        data: state.data.filter(element => element.id !== action.id),
      };

    default:
      return state;
  }
};
