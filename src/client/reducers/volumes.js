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
};

export default (state = initialState, action) => {
  switch (action.type) {

    // GET ALL
    case FETCH_VOLUMES:
      return {
        ...state,
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
      };

    // ONE
    case FETCH_VOLUME:
      return {
        ...state,
      };
    case FETCH_VOLUME_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case FETCH_VOLUME_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.volume),
        isFetched: true,
      };

    // CREATE
    case CREATE_VOLUME:
      return {
        ...state,
        isFetched: false,
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
      };

    // CHANGE
    case CHANGE_VOLUME:
      return {
        ...state,
        isFetched: false,
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
      };

    // DELETE
    case DELETE_VOLUME:
      return {
        ...state,
      };
    case DELETE_VOLUME_ERROR:
      return {
        ...state,
        e: action.e,
      };
    case DELETE_VOLUME_SUCCESS:
      return {
        ...state,
        data: state.data.filter(element => element.id !== action.id),
      };

    // PRUNE
    case PRUNE_VOLUMES:
      return {
        ...state,
      };
    case PRUNE_VOLUMES_ERROR:
      return {
        ...state,
        e: action.e,
      };
    case PRUNE_VOLUMES_SUCCESS:
      return {
        ...state,
        data: action.data.volumes,
      };

    // CLARIFY
    case SYNCHRONIZE_VOLUMES:
      return {
        ...state,
      };
    case SYNCHRONIZE_VOLUMES_ERROR:
      return {
        ...state,
        e: action.e,
      };
    case SYNCHRONIZE_VOLUMES_SUCCESS:
      return {
        ...state,
        data: action.data.volumes,
      };

    default:
      return state;
  }
};
