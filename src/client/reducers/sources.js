import {
  FETCH_SOURCES,
  FETCH_SOURCES_ERROR,
  FETCH_SOURCES_SUCCESS,
  FETCH_SOURCE,
  FETCH_SOURCE_ERROR,
  FETCH_SOURCE_SUCCESS,
  CREATE_SOURCE,
  CREATE_SOURCE_ERROR,
  CREATE_SOURCE_SUCCESS,
  CHANGE_SOURCE,
  CHANGE_SOURCE_ERROR,
  CHANGE_SOURCE_SUCCESS,
  DELETE_SOURCE,
  DELETE_SOURCE_ERROR,
  DELETE_SOURCE_SUCCESS,
} from '../actions/sources';

import { updateData } from '.';

const initialState = {
  data: [],
  e: null,
  isFetched: false,
  propsReady: false,
};

export default (state = initialState, action) => {
  switch (action.type) {

    // GET ALL
    case FETCH_SOURCES:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case FETCH_SOURCES_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case FETCH_SOURCES_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetched: true,
        e: null,
      };

    // ONE
    case FETCH_SOURCE:
      return {
        ...state,
        propsReady: false,
        isFetched: false,
        e: null,
      };
    case FETCH_SOURCE_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
        propsReady: true,
      };
    case FETCH_SOURCE_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.source),
        isFetched: true,
        propsReady: true,
        e: null,
      };

    // CREATE
    case CREATE_SOURCE:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case CREATE_SOURCE_ERROR:
      return {
        ...state,
        isFetched: true,
        e: action.e,
      };
    case CREATE_SOURCE_SUCCESS:
      return {
        ...state,
        data: [
          ...state.data,
          action.data.source,
        ],
        e: null,
        isFetched: true,
      };

    // CHANGE
    case CHANGE_SOURCE:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case CHANGE_SOURCE_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case CHANGE_SOURCE_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.source),
        isFetched: true,
        e: null,
      };

    // DELETE
    case DELETE_SOURCE:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case DELETE_SOURCE_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case DELETE_SOURCE_SUCCESS:
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
