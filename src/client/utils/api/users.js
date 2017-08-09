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
}

export default new UsersApi();
