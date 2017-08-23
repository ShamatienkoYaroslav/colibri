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
  UPLOAD_IMAGES,
  UPLOAD_IMAGES_ERROR,
  UPLOAD_IMAGES_SUCCESS,
} from '../actions/images';

import { updateData } from '.';

const initialState = {
  data: [],
  e: null,
  isFetched: false,
  uploading: false,
  propsReady: false,
};

export default (state = initialState, action) => {
  switch (action.type) {

    // GET ALL
    case FETCH_IMAGES:
      return {
        ...state,
        e: null,
        isFetched: false,
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
        e: null,
      };

    // ONE
    case FETCH_IMAGE:
      return {
        ...state,
        isFetched: false,
        propsReady: false,
        e: null,
      };
    case FETCH_IMAGE_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
        propsReady: true,
      };
    case FETCH_IMAGE_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.image),
        isFetched: true,
        propsReady: true,
        e: null,
      };

    // CREATE
    case CREATE_IMAGE:
      return {
        ...state,
        isFetched: false,
        e: null,
      };
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
        isFetched: true,
        e: null,
      };

    // CHANGE
    case CHANGE_IMAGE:
      return {
        ...state,
        isFetched: false,
        e: null,
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
        e: null,
      };

    // DELETE
    case DELETE_IMAGE:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case DELETE_IMAGE_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case DELETE_IMAGE_SUCCESS:
      return {
        ...state,
        data: state.data.filter(element => element.id !== action.id),
        isFetched: true,
        e: null,
      };

    // PRUNE
    case PRUNE_IMAGES:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case PRUNE_IMAGES_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case PRUNE_IMAGES_SUCCESS:
      return {
        ...state,
        data: action.data.images,
        e: null,
        isFetched: true,
      };

    // CLARIFY
    case CLARIFY_IMAGES:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case CLARIFY_IMAGES_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case CLARIFY_IMAGES_SUCCESS:
      return {
        ...state,
        data: action.data.images,
        isFetched: true,
        e: null,
      };

    // UPLOAD
    case UPLOAD_IMAGES:
      return {
        ...state,
        uploading: true,
        e: null,
      };
    case UPLOAD_IMAGES_ERROR:
      return {
        ...state,
        e: action.e,
        uploading: false,
      };
    case UPLOAD_IMAGES_SUCCESS:
      return {
        ...state,
        data: action.data.images,
        uploading: false,
        e: null,
      };

    default:
      return state;
  }
};
