import {
  FETCH_IMAGES,
  FETCH_IMAGES_ERROR,
  FETCH_IMAGES_SUCCESS,
  FETCH_IMAGE,
  FETCH_IMAGE_ERROR,
  FETCH_IMAGE_SUCCESS,
  CREATE_IMAGE,
  CREATE_IMAGE_ERROR,
  CREATE_IMAGE_SUCCESS,
  CHANGE_IMAGE,
  CHANGE_IMAGE_ERROR,
  CHANGE_IMAGE_SUCCESS,
  DELETE_IMAGE,
  DELETE_IMAGE_ERROR,
  DELETE_IMAGE_SUCCESS,
  CLARIFY_IMAGES,
  CLARIFY_IMAGES_ERROR,
  CLARIFY_IMAGES_SUCCESS,
  PRUNE_IMAGES,
  PRUNE_IMAGES_ERROR,
  PRUNE_IMAGES_SUCCESS,
} from '../actions/images';

import { updateData } from '.';

const initialState = {
  data: [],
  e: null,
  isFetched: false,
};

export default (state = initialState, action) => {
  switch (action.type) {

    // GET ALL
    case FETCH_IMAGES:
      return {
        ...state,
      };
    case FETCH_IMAGES_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case FETCH_IMAGES_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetched: true,
      };

    // ONE
    case FETCH_IMAGE:
      return {
        ...state,
      };
    case FETCH_IMAGE_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case FETCH_IMAGE_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.image),
        isFetched: true,
        currentImage: action.data.image,
      };

    // CREATE
    case CREATE_IMAGE:
      return state;
    case CREATE_IMAGE_ERROR:
      return {
        ...state,
        isFetched: true,
        e: action.e,
      };
    case CREATE_IMAGE_SUCCESS:
      return {
        ...state,
        data: [
          ...state.data,
          action.data.image,
        ],
      };

    // CHANGE
    case CHANGE_IMAGE:
      return {
        ...state,
      };
    case CHANGE_IMAGE_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case CHANGE_IMAGE_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.image),
        isFetched: true,
      };

    // DELETE
    case DELETE_IMAGE:
      return {
        ...state,
      };
    case DELETE_IMAGE_ERROR:
      return {
        ...state,
        e: action.e,
      };
    case DELETE_IMAGE_SUCCESS:
      return {
        ...state,
        data: state.data.filter(element => element.id !== action.id),
      };

    // PRUNE
    case PRUNE_IMAGES:
      return {
        ...state,
      };
    case PRUNE_IMAGES_ERROR:
      return {
        ...state,
        e: action.e,
      };
    case PRUNE_IMAGES_SUCCESS:
      return {
        ...state,
        data: action.data.images,
      };

    // CLARIFY
    case CLARIFY_IMAGES:
      return {
        ...state,
      };
    case CLARIFY_IMAGES_ERROR:
      return {
        ...state,
        e: action.e,
      };
    case CLARIFY_IMAGES_SUCCESS:
      return {
        ...state,
        data: action.data.images,
      };

    default:
      return state;
  }
};
