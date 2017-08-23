import {
  FETCH_VOLUMES,
  FETCH_VOLUMES_ERROR,
  FETCH_VOLUMES_SUCCESS,
  FETCH_VOLUME,
  FETCH_VOLUME_ERROR,
  FETCH_VOLUME_SUCCESS,
  CREATE_VOLUME,
  CREATE_VOLUME_ERROR,
  CREATE_VOLUME_SUCCESS,
  CHANGE_VOLUME,
  CHANGE_VOLUME_ERROR,
  CHANGE_VOLUME_SUCCESS,
  DELETE_VOLUME,
  DELETE_VOLUME_ERROR,
  DELETE_VOLUME_SUCCESS,
  PRUNE_VOLUMES,
  PRUNE_VOLUMES_ERROR,
  PRUNE_VOLUMES_SUCCESS,
  SYNCHRONIZE_VOLUMES,
  SYNCHRONIZE_VOLUMES_ERROR,
  SYNCHRONIZE_VOLUMES_SUCCESS,
} from '../actions/volumes';

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
    case FETCH_VOLUMES:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case FETCH_VOLUMES_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case FETCH_VOLUMES_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetched: true,
        e: null,
      };

    // ONE
    case FETCH_VOLUME:
      return {
        ...state,
        propsReady: false,
        e: null,
        isFetched: false,
      };
    case FETCH_VOLUME_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
        propsReady: true,
      };
    case FETCH_VOLUME_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.volume),
        isFetched: true,
        propsReady: true,
        e: null,
      };

    // CREATE
    case CREATE_VOLUME:
      return {
        ...state,
        isFetched: false,
        e: null,
      };
    case CREATE_VOLUME_ERROR:
      return {
        ...state,
        isFetched: true,
        e: action.e,
      };
    case CREATE_VOLUME_SUCCESS:
      return {
        ...state,
        data: [
          ...state.data,
          action.data.volume,
        ],
        e: null,
        isFetched: true,
      };

    // CHANGE
    case CHANGE_VOLUME:
      return {
        ...state,
        isFetched: false,
        e: null,
      };
    case CHANGE_VOLUME_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case CHANGE_VOLUME_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.volume),
        isFetched: true,
        e: null,
      };

    // DELETE
    case DELETE_VOLUME:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case DELETE_VOLUME_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case DELETE_VOLUME_SUCCESS:
      return {
        ...state,
        data: state.data.filter(element => element.id !== action.id),
        isFetched: true,
        e: null,
      };

    // PRUNE
    case PRUNE_VOLUMES:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case PRUNE_VOLUMES_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case PRUNE_VOLUMES_SUCCESS:
      return {
        ...state,
        data: action.data.volumes,
        isFetched: true,
        e: null,
      };

    // CLARIFY
    case SYNCHRONIZE_VOLUMES:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case SYNCHRONIZE_VOLUMES_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case SYNCHRONIZE_VOLUMES_SUCCESS:
      return {
        ...state,
        data: action.data.volumes,
        e: null,
        isFetched: true,
      };

    default:
      return state;
  }
};
