import axios from 'axios';

import Auth from '../auth';

class VolumesApi {
  constructor() {
    this.path = '/volume';
  }

  async fetchVolumes() {
    const { data } = await axios({
      method: 'get',
      url: this.path,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async fetchVolume(id) {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async createVolume(payload) {
    const { data } = await axios({
      method: 'post',
      url: `${this.path}`,
      headers: { authorization: Auth.getToken() },
      data: payload,
    });
    return data;
  }

  async changeVolume(id, payload) {
    const { data } = await axios({
      method: 'put',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
      data: payload,
    });
    return data;
  }

  async deleteVolume(id) {
    const { data } = await await axios({
      method: 'delete',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async pruneVolumes() {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/prune`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async synchronizeVolumes() {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/refresh`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }
}

export default new VolumesApi();
