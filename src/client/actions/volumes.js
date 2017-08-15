import { VolumesApi } from '../utils';

export const FETCH_VOLUMES = 'FETCH_VOLUMES';
export const FETCH_VOLUMES_ERROR = 'FETCH_VOLUMES_ERROR';
export const FETCH_VOLUMES_SUCCESS = 'FETCH_VOLUMES_SUCCESS';

export const FETCH_VOLUME = 'FETCH_VOLUME';
export const FETCH_VOLUME_ERROR = 'FETCH_VOLUME_ERROR';
export const FETCH_VOLUME_SUCCESS = 'FETCH_VOLUME_SUCCESS';

export const CREATE_VOLUME = 'CREATE_VOLUME';
export const CREATE_VOLUME_ERROR = 'CREATE_VOLUME_ERROR';
export const CREATE_VOLUME_SUCCESS = 'CREATE_VOLUME_SUCCESS';

export const CHANGE_VOLUME = 'CHANGE_VOLUME';
export const CHANGE_VOLUME_ERROR = 'CHANGE_VOLUME_ERROR';
export const CHANGE_VOLUME_SUCCESS = 'CHANGE_VOLUME_SUCCESS';

export const DELETE_VOLUME = 'DELETE_VOLUME';
export const DELETE_VOLUME_ERROR = 'DELETE_VOLUME_ERROR';
export const DELETE_VOLUME_SUCCESS = 'DELETE_VOLUME_SUCCESS';

export const CLARIFY_VOLUMES = 'CLARIFY_VOLUMES';
export const CLARIFY_VOLUMES_ERROR = 'CLARIFY_VOLUMES_ERROR';
export const CLARIFY_VOLUMES_SUCCESS = 'CLARIFY_VOLUMES_SUCCESS';

export const SYNCHRONIZE_VOLUMES = 'SYNCHRONIZE_VOLUMES';
export const SYNCHRONIZE_VOLUMES_ERROR = 'SYNCHRONIZE_VOLUMES_ERROR';
export const SYNCHRONIZE_VOLUMES_SUCCESS = 'SYNCHRONIZE_VOLUMES_SUCCESS';

export const PRUNE_VOLUMES = 'PRUNE_VOLUMES';
export const PRUNE_VOLUMES_ERROR = 'PRUNE_VOLUMES_ERROR';
export const PRUNE_VOLUMES_SUCCESS = 'PRUNE_VOLUMES_SUCCESS';

export const fetchVolumes = () => (
  async (dispatch) => {
    dispatch({ type: FETCH_VOLUMES });
    try {
      const data = await VolumesApi.fetchVolumes();
      return dispatch({ type: FETCH_VOLUMES_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_VOLUMES_ERROR,
        e,
      });
    }
  }
);

export const fetchVolume = id => (
  async (dispatch) => {
    dispatch({ type: FETCH_VOLUME });
    try {
      const data = await VolumesApi.fetchVolume(id);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: FETCH_VOLUME_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_VOLUME_ERROR,
        e,
      });
    }
  }
);

export const createVolume = payload => (
  async (dispatch) => {
    dispatch({ type: CREATE_VOLUME });
    try {
      const data = await VolumesApi.createVolume(payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CREATE_VOLUME_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CREATE_VOLUME_ERROR,
        e,
      });
    }
  }
);

export const changeVolume = (id, payload) => (
  async (dispatch) => {
    dispatch({ type: CHANGE_VOLUME });
    try {
      const data = await VolumesApi.changeVolume(id, payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CHANGE_VOLUME_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CHANGE_VOLUME_ERROR,
        e,
      });
    }
  }
);

export const deleteVolume = id => (
  async (dispatch) => {
    dispatch({ type: DELETE_VOLUME });
    try {
      const data = await VolumesApi.deleteVolume(id);
      if (!data.success) {
        throw data.messages;
      }
      return dispatch({ type: DELETE_VOLUME_SUCCESS, id });
    } catch (e) {
      return dispatch({
        type: DELETE_VOLUME_ERROR,
        e,
      });
    }
  }
);

export const synchronizeVolumes = () => (
  async (dispatch) => {
    dispatch({ type: SYNCHRONIZE_VOLUMES });
    try {
      const data = await VolumesApi.synchronizeVolumes();
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: SYNCHRONIZE_VOLUMES_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: SYNCHRONIZE_VOLUMES_ERROR,
        e,
      });
    }
  }
);

export const pruneVolumes = () => (
  async (dispatch) => {
    dispatch({ type: PRUNE_VOLUMES });
    try {
      const data = await VolumesApi.pruneVolumes();
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: PRUNE_VOLUMES_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: PRUNE_VOLUMES_ERROR,
        e,
      });
    }
  }
);
