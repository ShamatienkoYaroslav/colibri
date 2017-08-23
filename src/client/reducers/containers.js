import {
  FETCH_CONTAINERS,
  FETCH_CONTAINERS_ERROR,
  FETCH_CONTAINERS_SUCCESS,
  FETCH_CONTAINER,
  FETCH_CONTAINER_ERROR,
  FETCH_CONTAINER_SUCCESS,
  CREATE_CONTAINER,
  CREATE_CONTAINER_ERROR,
  CREATE_CONTAINER_SUCCESS,
  CHANGE_CONTAINER,
  CHANGE_CONTAINER_ERROR,
  CHANGE_CONTAINER_SUCCESS,
  DELETE_CONTAINER,
  DELETE_CONTAINER_ERROR,
  DELETE_CONTAINER_SUCCESS,
  START_CONTAINER,
  START_CONTAINER_ERROR,
  START_CONTAINER_SUCCESS,
  STOP_CONTAINER,
  STOP_CONTAINER_ERROR,
  STOP_CONTAINER_SUCCESS,
  PRUNE_CONTAINERS,
  PRUNE_CONTAINERS_ERROR,
  PRUNE_CONTAINERS_SUCCESS,
  SYNCHRONIZE_CONTAINERS,
  SYNCHRONIZE_CONTAINERS_ERROR,
  SYNCHRONIZE_CONTAINERS_SUCCESS,
} from '../actions/containers';

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
    case FETCH_CONTAINERS:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case FETCH_CONTAINERS_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case FETCH_CONTAINERS_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetched: true,
        e: null,
      };

    // ONE
    case FETCH_CONTAINER:
      return {
        ...state,
        propsReady: false,
        e: null,
        isFetched: false,
      };
    case FETCH_CONTAINER_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
        propsReady: true,
      };
    case FETCH_CONTAINER_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.container),
        isFetched: true,
        propsReady: true,
        e: null,
      };

    // CREATE
    case CREATE_CONTAINER:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case CREATE_CONTAINER_ERROR:
      return {
        ...state,
        isFetched: true,
        e: action.e,
      };
    case CREATE_CONTAINER_SUCCESS:
      return {
        ...state,
        data: [
          ...state.data,
          action.data.container,
        ],
        e: null,
        isFetched: true,
      };

    // CHANGE
    case CHANGE_CONTAINER:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case CHANGE_CONTAINER_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case CHANGE_CONTAINER_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.container),
        isFetched: true,
        e: null,
      };

    // DELETE
    case DELETE_CONTAINER:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case DELETE_CONTAINER_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case DELETE_CONTAINER_SUCCESS:
      return {
        ...state,
        data: state.data.filter(element => element.id !== action.id),
        e: null,
        isFetched: true,
      };

    // START
    case START_CONTAINER:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case START_CONTAINER_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case START_CONTAINER_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.container),
        isFetched: true,
        e: null,
      };

    // STOP
    case STOP_CONTAINER:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case STOP_CONTAINER_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case STOP_CONTAINER_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.container),
        isFetched: true,
        e: null,
      };

    // PRUNE
    case PRUNE_CONTAINERS:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case PRUNE_CONTAINERS_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case PRUNE_CONTAINERS_SUCCESS:
      return {
        ...state,
        data: action.data.containers,
        isFetched: true,
        e: null,
      };

    // SYNCHRONIZE
    case SYNCHRONIZE_CONTAINERS:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case SYNCHRONIZE_CONTAINERS_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case SYNCHRONIZE_CONTAINERS_SUCCESS:
      return {
        ...state,
        data: action.data.containers,
        isFetched: true,
        e: null,
      };

    default:
      return state;
  }
};
