import { SourcesApi } from '../utils';

export const FETCH_SOURCES = 'FETCH_SOURCES';
export const FETCH_SOURCES_ERROR = 'FETCH_SOURCES_ERROR';
export const FETCH_SOURCES_SUCCESS = 'FETCH_SOURCES_SUCCESS';

export const FETCH_SOURCE = 'FETCH_SOURCE';
export const FETCH_SOURCE_ERROR = 'FETCH_SOURCE_ERROR';
export const FETCH_SOURCE_SUCCESS = 'FETCH_SOURCE_SUCCESS';

export const CREATE_SOURCE = 'CREATE_CSOURCE';
export const CREATE_SOURCE_ERROR = 'CREATE_SOURCE_ERROR';
export const CREATE_SOURCE_SUCCESS = 'CREATE_SOURCE_SUCCESS';

export const CHANGE_SOURCE = 'CHANGE_SOURCE';
export const CHANGE_SOURCE_ERROR = 'CHANGE_SOURCE_ERROR';
export const CHANGE_SOURCE_SUCCESS = 'CHANGE_SOURCE_SUCCESS';

export const DELETE_SOURCE = 'DELETE_SOURCE';
export const DELETE_SOURCE_ERROR = 'DELETE_SOURCE_ERROR';
export const DELETE_SOURCE_SUCCESS = 'DELETE_SOURCE_SUCCESS';

export const fetchSources = () => (
  async (dispatch) => {
    dispatch({ type: FETCH_SOURCES });
    try {
      const data = await SourcesApi.fetchSources();
      return dispatch({ type: FETCH_SOURCES_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_SOURCES_ERROR,
        e,
      });
    }
  }
);

export const fetchSource = id => (
  async (dispatch) => {
    dispatch({ type: FETCH_SOURCE });
    try {
      const data = await SourcesApi.fetchSource(id);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: FETCH_SOURCE_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_SOURCE_ERROR,
        e,
      });
    }
  }
);

export const createSource = payload => (
  async (dispatch) => {
    dispatch({ type: CREATE_SOURCE });
    try {
      const data = await SourcesApi.createSource(payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CREATE_SOURCE_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CREATE_SOURCE_ERROR,
        e,
      });
    }
  }
);

export const changeSource = (id, payload) => (
  async (dispatch) => {
    dispatch({ type: CHANGE_SOURCE });
    try {
      const data = await SourcesApi.changeSource(id, payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CHANGE_SOURCE_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CHANGE_SOURCE_ERROR,
        e,
      });
    }
  }
);

export const deleteSource = id => (
  async (dispatch) => {
    dispatch({ type: DELETE_SOURCE });
    try {
      const data = await SourcesApi.deleteSource(id);
      if (!data.success) {
        throw data.messages;
      }
      return dispatch({ type: DELETE_SOURCE_SUCCESS, id });
    } catch (e) {
      return dispatch({
        type: DELETE_SOURCE_ERROR,
        e,
      });
    }
  }
);
