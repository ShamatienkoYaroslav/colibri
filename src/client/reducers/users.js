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
  propsReady: false,
};

export default (state = initialState, action) => {
  switch (action.type) {

    // LOGIN
    case USER_LOGIN:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
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
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case USER_LOGOUT_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        loggedIn: action.loggedIn,
        e: null,
        isFetched: true,
      };

    // ALL
    case FETCH_USERS:
      return {
        ...state,
        e: null,
        isFetched: false,
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
        e: null,
      };

    // ONE
    case FETCH_USER:
      return {
        ...state,
        propsReady: false,
        isFetched: false,
        e: null,
      };
    case FETCH_USER_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
        propsReady: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.user),
        isFetched: true,
        propsReady: true,
        e: null,
      };

    // CREATE
    case CREATE_USER:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
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
        e: null,
        isFetched: true,
      };

    // CHANGE
    case CHANGE_USER:
      return {
        ...state,
        e: null,
        isFetched: false,
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
        e: null,
      };

    // DELETE
    case DELETE_USER:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case DELETE_USER_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        data: state.data.filter(element => element.id !== action.id),
        e: null,
        isFetched: true,
      };

    default:
      return state;
  }
};
