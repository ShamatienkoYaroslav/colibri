import { TemplatesApi } from '../utils';

export const FETCH_TEMPLATES = 'FETCH_TEMPLATES';
export const FETCH_TEMPLATES_ERROR = 'FETCH_TEMPLATES_ERROR';
export const FETCH_TEMPLATES_SUCCESS = 'FETCH_TEMPLATES_SUCCESS';

export const FETCH_TEMPLATE = 'FETCH_TEMPLATE';
export const FETCH_TEMPLATE_ERROR = 'FETCH_TEMPLATE_ERROR';
export const FETCH_TEMPLATE_SUCCESS = 'FETCH_TEMPLATE_SUCCESS';

export const CREATE_TEMPLATE = 'CREATE_CTEMPLATE';
export const CREATE_TEMPLATE_ERROR = 'CREATE_TEMPLATE_ERROR';
export const CREATE_TEMPLATE_SUCCESS = 'CREATE_TEMPLATE_SUCCESS';

export const CHANGE_TEMPLATE = 'CHANGE_TEMPLATE';
export const CHANGE_TEMPLATE_ERROR = 'CHANGE_TEMPLATE_ERROR';
export const CHANGE_TEMPLATE_SUCCESS = 'CHANGE_TEMPLATE_SUCCESS';

export const DELETE_TEMPLATE = 'DELETE_TEMPLATE';
export const DELETE_TEMPLATE_ERROR = 'DELETE_TEMPLATE_ERROR';
export const DELETE_TEMPLATE_SUCCESS = 'DELETE_TEMPLATE_SUCCESS';

export const fetchTemplates = () => (
  async (dispatch) => {
    dispatch({ type: FETCH_TEMPLATES });
    try {
      const data = await TemplatesApi.fetchTemplates();
      return dispatch({ type: FETCH_TEMPLATES_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_TEMPLATES_ERROR,
        e,
      });
    }
  }
);

export const fetchTemplate = id => (
  async (dispatch) => {
    dispatch({ type: FETCH_TEMPLATE });
    try {
      const data = await TemplatesApi.fetchTemplate(id);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: FETCH_TEMPLATE_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_TEMPLATE_ERROR,
        e,
      });
    }
  }
);

export const createTemplate = payload => (
  async (dispatch) => {
    dispatch({ type: CREATE_TEMPLATE });
    try {
      const data = await TemplatesApi.createTemplate(payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CREATE_TEMPLATE_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CREATE_TEMPLATE_ERROR,
        e,
      });
    }
  }
);

export const changeTemplate = (id, payload) => (
  async (dispatch) => {
    dispatch({ type: CHANGE_TEMPLATE });
    try {
      const data = await TemplatesApi.changeTemplate(id, payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CHANGE_TEMPLATE_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CHANGE_TEMPLATE_ERROR,
        e,
      });
    }
  }
);

export const deleteTemplate = id => (
  async (dispatch) => {
    dispatch({ type: DELETE_TEMPLATE });
    try {
      const data = await TemplatesApi.deleteTemplate(id);
      if (!data.success) {
        throw data.messages;
      }
      return dispatch({ type: DELETE_TEMPLATE_SUCCESS, id });
    } catch (e) {
      return dispatch({
        type: DELETE_TEMPLATE_ERROR,
        e,
      });
    }
  }
);
