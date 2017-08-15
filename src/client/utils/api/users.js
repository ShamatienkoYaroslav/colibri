import axios from 'axios';

import Auth from '../auth';

class UsersApi {
  constructor() {
    this.path = '/user';
  }

  async login(user, password) {
    const { data } = await axios.post(`${this.path}/login`, { user, password });
    return data;
  }

  async fetchUsers() {
    const { data } = await axios({
      method: 'get',
      url: this.path,
    });
    return data;
  }

  async fetchUser(id) {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async createUser(payload) {
    const { data } = await await axios({
      method: 'post',
      url: `${this.path}`,
      headers: { authorization: Auth.getToken() },
      data: payload,
    });
    return data;
  }

  async changeUser(id, payload) {
    const { data } = await await axios({
      method: 'put',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
      data: payload,
    });
    return data;
  }

  async deleteUser(id) {
    const { data } = await await axios({
      method: 'delete',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }
}

export default new UsersApi();
