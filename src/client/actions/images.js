import { ImagesApi } from '../utils';

export const FETCH_IMAGES = 'FETCH_IMAGES';
export const FETCH_IMAGES_ERROR = 'FETCH_IMAGES_ERROR';
export const FETCH_IMAGES_SUCCESS = 'FETCH_IMAGES_SUCCESS';

export const FETCH_IMAGE = 'FETCH_IMAGE';
export const FETCH_IMAGE_ERROR = 'FETCH_IMAGE_ERROR';
export const FETCH_IMAGE_SUCCESS = 'FETCH_IMAGE_SUCCESS';

export const CREATE_IMAGE = 'CREATE_IMAGE';
export const CREATE_IMAGE_ERROR = 'CREATE_IMAGE_ERROR';
export const CREATE_IMAGE_SUCCESS = 'CREATE_IMAGE_SUCCESS';

export const CHANGE_IMAGE = 'CHANGE_IMAGE';
export const CHANGE_IMAGE_ERROR = 'CHANGE_IMAGE_ERROR';
export const CHANGE_IMAGE_SUCCESS = 'CHANGE_IMAGE_SUCCESS';

export const DELETE_IMAGE = 'DELETE_IMAGE';
export const DELETE_IMAGE_ERROR = 'DELETE_IMAGE_ERROR';
export const DELETE_IMAGE_SUCCESS = 'DELETE_IMAGE_SUCCESS';

export const CLARIFY_IMAGES = 'CLARIFY_IMAGES';
export const CLARIFY_IMAGES_ERROR = 'CLARIFY_IMAGES_ERROR';
export const CLARIFY_IMAGES_SUCCESS = 'CLARIFY_IMAGES_SUCCESS';

export const PRUNE_IMAGES = 'PRUNE_IMAGES';
export const PRUNE_IMAGES_ERROR = 'PRUNE_IMAGES_ERROR';
export const PRUNE_IMAGES_SUCCESS = 'PRUNE_IMAGES_SUCCESS';

export const UPLOAD_IMAGES = 'UPLOAD_IMAGES';
export const UPLOAD_IMAGES_ERROR = 'UPLOAD_IMAGES_ERROR';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';

export const fetchImages = () => (
  async (dispatch) => {
    dispatch({ type: FETCH_IMAGES });
    try {
      const data = await ImagesApi.fetchImages();
      return dispatch({ type: FETCH_IMAGES_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_IMAGES_ERROR,
        e,
      });
    }
  }
);

export const fetchImage = id => (
  async (dispatch) => {
    dispatch({ type: FETCH_IMAGE });
    try {
      const data = await ImagesApi.fetchImage(id);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: FETCH_IMAGE_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_IMAGE_ERROR,
        e,
      });
    }
  }
);

export const createImage = payload => (
  async (dispatch) => {
    dispatch({ type: CREATE_IMAGE });
    try {
      const data = await ImagesApi.createImage(payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CREATE_IMAGE_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CREATE_IMAGE_ERROR,
        e,
      });
    }
  }
);

export const changeImage = (id, payload) => (
  async (dispatch) => {
    dispatch({ type: CHANGE_IMAGE });
    try {
      const data = await ImagesApi.changeImage(id, payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CHANGE_IMAGE_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CHANGE_IMAGE_ERROR,
        e,
      });
    }
  }
);

export const deleteImage = id => (
  async (dispatch) => {
    dispatch({ type: DELETE_IMAGE });
    try {
      const data = await ImagesApi.deleteImage(id);
      if (!data.success) {
        throw data.messages;
      }
      return dispatch({ type: DELETE_IMAGE_SUCCESS, id });
    } catch (e) {
      return dispatch({
        type: DELETE_IMAGE_ERROR,
        e,
      });
    }
  }
);

export const getInfo = id => (
  async (dispatch) => {
    dispatch({ type: GET_INFO_IMAGE });
    try {
      const data = await ImagesApi.getInfo(id);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: GET_INFO_IMAGE_SUCCESS, id });
    } catch (e) {
      return dispatch({
        type: GET_INFO_IMAGE_ERROR,
        e,
      });
    }
  }
);

export const clarifyImages = () => (
  async (dispatch) => {
    dispatch({ type: CLARIFY_IMAGES });
    try {
      const data = await ImagesApi.clarifyImages();
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CLARIFY_IMAGES_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CLARIFY_IMAGES_ERROR,
        e,
      });
    }
  }
);

export const pruneImages = () => (
  async (dispatch) => {
    dispatch({ type: PRUNE_IMAGES });
    try {
      const data = await ImagesApi.pruneImages();
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: PRUNE_IMAGES_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: PRUNE_IMAGES_ERROR,
        e,
      });
    }
  }
);

export const loadImages = file => (
  async (dispatch) => {
    dispatch({ type: UPLOAD_IMAGES });
    try {
      const data = await ImagesApi.loadImages(file);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: UPLOAD_IMAGES_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: UPLOAD_IMAGES_ERROR,
        e,
      });
    }
  }
);
