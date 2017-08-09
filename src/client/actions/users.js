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
