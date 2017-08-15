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
};

export default (state = initialState, action) => {
  switch (action.type) {

    // GET ALL
    case FETCH_CONTAINERS:
      return {
        ...state,
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
      };

    // ONE
    case FETCH_CONTAINER:
      return {
        ...state,
      };
    case FETCH_CONTAINER_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case FETCH_CONTAINER_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.container),
        isFetched: true,
      };

    // CREATE
    case CREATE_CONTAINER:
      return state;
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
      };

    // CHANGE
    case CHANGE_CONTAINER:
      return {
        ...state,
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
      };

    // DELETE
    case DELETE_CONTAINER:
      return {
        ...state,
      };
    case DELETE_CONTAINER_ERROR:
      return {
        ...state,
        e: action.e,
      };
    case DELETE_CONTAINER_SUCCESS:
      return {
        ...state,
        data: state.data.filter(element => element.id !== action.id),
      };

    // START
    case START_CONTAINER:
      return {
        ...state,
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
      };

    // STOP
    case STOP_CONTAINER:
      return {
        ...state,
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
      };

    // PRUNE
    case PRUNE_CONTAINERS:
      return {
        ...state,
      };
    case PRUNE_CONTAINERS_ERROR:
      return {
        ...state,
        e: action.e,
      };
    case PRUNE_CONTAINERS_SUCCESS:
      return {
        ...state,
        data: action.data.containers,
      };

    // SYNCHRONIZE
    case SYNCHRONIZE_CONTAINERS:
      return {
        ...state,
      };
    case SYNCHRONIZE_CONTAINERS_ERROR:
      return {
        ...state,
        e: action.e,
      };
    case SYNCHRONIZE_CONTAINERS_SUCCESS:
      return {
        ...state,
        data: action.data.containers,
      };

    default:
      return state;
  }
};
