import { ContainersApi } from '../utils';

export const FETCH_CONTAINERS = 'FETCH_CONTAINERS';
export const FETCH_CONTAINERS_ERROR = 'FETCH_CONTAINERS_ERROR';
export const FETCH_CONTAINERS_SUCCESS = 'FETCH_CONTAINERS_SUCCESS';

export const FETCH_CONTAINER = 'FETCH_CONTAINER';
export const FETCH_CONTAINER_ERROR = 'FETCH_CONTAINER_ERROR';
export const FETCH_CONTAINER_SUCCESS = 'FETCH_CONTAINER_SUCCESS';

export const CREATE_CONTAINER = 'CREATE_CCONTAINER';
export const CREATE_CONTAINER_ERROR = 'CREATE_CONTAINER_ERROR';
export const CREATE_CONTAINER_SUCCESS = 'CREATE_CONTAINER_SUCCESS';

export const CHANGE_CONTAINER = 'CHANGE_CONTAINER';
export const CHANGE_CONTAINER_ERROR = 'CHANGE_CONTAINER_ERROR';
export const CHANGE_CONTAINER_SUCCESS = 'CHANGE_CONTAINER_SUCCESS';

export const DELETE_CONTAINER = 'DELETE_CONTAINER';
export const DELETE_CONTAINER_ERROR = 'DELETE_CONTAINER_ERROR';
export const DELETE_CONTAINER_SUCCESS = 'DELETE_CONTAINER_SUCCESS';

export const START_CONTAINER = 'START_CONTAINER';
export const START_CONTAINER_ERROR = 'START_CONTAINER_ERROR';
export const START_CONTAINER_SUCCESS = 'START_CONTAINER_SUCCESS';

export const STOP_CONTAINER = 'STOP_CONTAINER';
export const STOP_CONTAINER_ERROR = 'STOP_CONTAINER_ERROR';
export const STOP_CONTAINER_SUCCESS = 'STOP_CONTAINER_SUCCESS';

export const PRUNE_CONTAINERS = 'PRUNE_CONTAINERS';
export const PRUNE_CONTAINERS_ERROR = 'PRUNE_CONTAINERS_ERROR';
export const PRUNE_CONTAINERS_SUCCESS = 'PRUNE_CONTAINERS_SUCCESS';

export const SYNCHRONIZE_CONTAINERS = 'SYNCHRONIZE_CONTAINERS';
export const SYNCHRONIZE_CONTAINERS_ERROR = 'SYNCHRONIZE_CONTAINERS_ERROR';
export const SYNCHRONIZE_CONTAINERS_SUCCESS = 'SYNCHRONIZE_CONTAINERS_SUCCESS';

export const fetchContainers = () => (
  async (dispatch) => {
    dispatch({ type: FETCH_CONTAINERS });
    try {
      const data = await ContainersApi.fetchContainers();
      return dispatch({ type: FETCH_CONTAINERS_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_CONTAINERS_ERROR,
        e,
      });
    }
  }
);

export const fetchContainer = id => (
  async (dispatch) => {
    dispatch({ type: FETCH_CONTAINER });
    try {
      const data = await ContainersApi.fetchContainer(id);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: FETCH_CONTAINER_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_CONTAINER_ERROR,
        e,
      });
    }
  }
);

export const createContainer = payload => (
  async (dispatch) => {
    dispatch({ type: CREATE_CONTAINER });
    try {
      const data = await ContainersApi.createContainer(payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CREATE_CONTAINER_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CREATE_CONTAINER_ERROR,
        e,
      });
    }
  }
);

export const changeContainer = (id, payload) => (
  async (dispatch) => {
    dispatch({ type: CHANGE_CONTAINER });
    try {
      const data = await ContainersApi.changeContainer(id, payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CHANGE_CONTAINER_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CHANGE_CONTAINER_ERROR,
        e,
      });
    }
  }
);

export const deleteContainer = id => (
  async (dispatch) => {
    dispatch({ type: DELETE_CONTAINER });
    try {
      const data = await ContainersApi.deleteContainer(id);
      if (!data.success) {
        throw data.messages;
      }
      return dispatch({ type: DELETE_CONTAINER_SUCCESS, id });
    } catch (e) {
      return dispatch({
        type: DELETE_CONTAINER_ERROR,
        e,
      });
    }
  }
);

export const startContainer = id => (
  async (dispatch) => {
    dispatch({ type: START_CONTAINER });
    try {
      const data = await ContainersApi.startContainer(id);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: START_CONTAINER_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: START_CONTAINER_ERROR,
        e,
      });
    }
  }
);

export const stopContainer = id => (
  async (dispatch) => {
    dispatch({ type: STOP_CONTAINER });
    try {
      const data = await ContainersApi.stopContainer(id);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: STOP_CONTAINER_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: STOP_CONTAINER_ERROR,
        e,
      });
    }
  }
);

export const pruneContainers = () => (
  async (dispatch) => {
    dispatch({ type: PRUNE_CONTAINERS });
    try {
      const data = await ContainersApi.pruneContainers();
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: PRUNE_CONTAINERS_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: PRUNE_CONTAINERS_ERROR,
        e,
      });
    }
  }
);

export const synchronizeContainers = () => (
  async (dispatch) => {
    dispatch({ type: SYNCHRONIZE_CONTAINERS });
    try {
      const data = await ContainersApi.synchronizeContainers();
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: SYNCHRONIZE_CONTAINERS_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: SYNCHRONIZE_CONTAINERS_ERROR,
        e,
      });
    }
  }
);