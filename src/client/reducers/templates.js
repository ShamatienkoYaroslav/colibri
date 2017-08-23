import {
  FETCH_TEMPLATES,
  FETCH_TEMPLATES_ERROR,
  FETCH_TEMPLATES_SUCCESS,
  FETCH_TEMPLATE,
  FETCH_TEMPLATE_ERROR,
  FETCH_TEMPLATE_SUCCESS,
  CREATE_TEMPLATE,
  CREATE_TEMPLATE_ERROR,
  CREATE_TEMPLATE_SUCCESS,
  CHANGE_TEMPLATE,
  CHANGE_TEMPLATE_ERROR,
  CHANGE_TEMPLATE_SUCCESS,
  DELETE_TEMPLATE,
  DELETE_TEMPLATE_ERROR,
  DELETE_TEMPLATE_SUCCESS,
} from '../actions/templates';

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
    case FETCH_TEMPLATES:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case FETCH_TEMPLATES_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case FETCH_TEMPLATES_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetched: true,
        e: null,
      };

    // ONE
    case FETCH_TEMPLATE:
      return {
        ...state,
        propsReady: false,
        e: null,
        isFetched: false,
      };
    case FETCH_TEMPLATE_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
        propsReady: true,
      };
    case FETCH_TEMPLATE_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.template),
        isFetched: true,
        propsReady: true,
        e: null,
      };

    // CREATE
    case CREATE_TEMPLATE:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case CREATE_TEMPLATE_ERROR:
      return {
        ...state,
        isFetched: true,
        e: action.e,
      };
    case CREATE_TEMPLATE_SUCCESS:
      return {
        ...state,
        data: [
          ...state.data,
          action.data.template,
        ],
        e: null,
        isFetched: true,
      };

    // CHANGE
    case CHANGE_TEMPLATE:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case CHANGE_TEMPLATE_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case CHANGE_TEMPLATE_SUCCESS:
      return {
        ...state,
        data: updateData(state.data, action.data.template),
        isFetched: true,
        e: null,
      };

    // DELETE
    case DELETE_TEMPLATE:
      return {
        ...state,
        e: null,
        isFetched: false,
      };
    case DELETE_TEMPLATE_ERROR:
      return {
        ...state,
        e: action.e,
        isFetched: true,
      };
    case DELETE_TEMPLATE_SUCCESS:
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
