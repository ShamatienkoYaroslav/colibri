import axios from 'axios';

import Auth from '../auth';

class ContainersApi {
  constructor() {
    this.path = '/container';
  }

  async fetchContainers() {
    const { data } = await axios({
      method: 'get',
      url: this.path,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async fetchContainer(id) {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async createContainer(payload) {
    const { data } = await await axios({
      method: 'post',
      url: `${this.path}`,
      headers: { authorization: Auth.getToken() },
      data: payload,
    });
    return data;
  }

  async changeContainer(id, payload) {
    const { data } = await await axios({
      method: 'put',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
      data: payload,
    });
    return data;
  }

  async deleteContainer(id) {
    const { data } = await await axios({
      method: 'delete',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async startContainer(id) {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/${id}/start`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async stopContainer(id) {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/${id}/stop`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async pruneContainers() {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/prune`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async synchronizeContainers() {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/refresh`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }
}

export default new ContainersApi();
