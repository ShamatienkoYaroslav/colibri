import { UsersApi, Auth } from '../utils';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';

export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_LOGOUT_ERROR = 'USER_LOGOUT_ERROR';
export const USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USERS_ERROR = 'FETCH_USERS_ERROR';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

export const CREATE_USER = 'CREATE_CUSER';
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';

export const CHANGE_USER = 'CHANGE_USER';
export const CHANGE_USER_ERROR = 'CHANGE_USER_ERROR';
export const CHANGE_USER_SUCCESS = 'CHANGE_USER_SUCCESS';

export const DELETE_USER = 'DELETE_USER';
export const DELETE_USER_ERROR = 'DELETE_USER_ERROR';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';

export const login = (user, password) => (
  async (dispatch) => {
    dispatch({ type: USER_LOGIN });
    try {
      const data = await UsersApi.login(user, password);
      if (data.token) {
        const { name, id, role, slug } = data.user;
        Auth.authUser(data.token, name, id, role, slug);
      }
      dispatch({
        type: USER_LOGIN_SUCCESS,
        user: data.user,
        loggedIn: Auth.tokenIsSet(),
      });
    } catch (e) {
      dispatch({ type: USER_LOGIN_ERROR, e });
    }
  }
);

export const logout = () => (
  async (dispatch) => {
    dispatch({ type: USER_LOGOUT });
    try {
      Auth.unauthUser();
      dispatch({
        type: USER_LOGOUT_SUCCESS,
        loggedIn: Auth.tokenIsSet(),
      });
    } catch (e) {
      dispatch({ type: USER_LOGOUT_ERROR, e });
    }
  }
);

export const fetchUsers = () => (
  async (dispatch) => {
    dispatch({ type: FETCH_USERS });
    try {
      const data = await UsersApi.fetchUsers();
      return dispatch({ type: FETCH_USERS_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_USERS_ERROR,
        e,
      });
    }
  }
);

export const fetchUser = id => (
  async (dispatch) => {
    dispatch({ type: FETCH_USER });
    try {
      const data = await UsersApi.fetchUser(id);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: FETCH_USER_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: FETCH_USER_ERROR,
        e,
      });
    }
  }
);

export const createUser = payload => (
  async (dispatch) => {
    dispatch({ type: CREATE_USER });
    try {
      const data = await UsersApi.createUser(payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CREATE_USER_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CREATE_USER_ERROR,
        e,
      });
    }
  }
);

export const changeUser = (id, payload) => (
  async (dispatch) => {
    dispatch({ type: CHANGE_USER });
    try {
      const data = await UsersApi.changeUser(id, payload);
      if (data.messages.length !== 0) {
        throw data.messages;
      }
      return dispatch({ type: CHANGE_USER_SUCCESS, data });
    } catch (e) {
      return dispatch({
        type: CHANGE_USER_ERROR,
        e,
      });
    }
  }
);

export const deleteUser = id => (
  async (dispatch) => {
    dispatch({ type: DELETE_USER });
    try {
      const data = await UsersApi.deleteUser(id);
      if (!data.success) {
        throw data.messages;
      }
      return dispatch({ type: DELETE_USER_SUCCESS, id });
    } catch (e) {
      return dispatch({
        type: DELETE_USER_ERROR,
        e,
      });
    }
  }
);
