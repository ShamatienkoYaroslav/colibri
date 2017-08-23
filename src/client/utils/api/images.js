import axios from 'axios';

import Auth from '../auth';

class ImagesApi {
  constructor() {
    this.path = '/image';
  }

  async fetchImages() {
    const { data } = await axios({
      method: 'get',
      url: this.path,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async fetchImage(id) {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async createImage(payload) {
    const { data } = await axios({
      method: 'post',
      url: `${this.path}`,
      headers: { authorization: Auth.getToken() },
      data: payload,
    });
    return data;
  }

  async changeImage(id, payload) {
    const { data } = await axios({
      method: 'put',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
      data: payload,
    });
    return data;
  }

  async deleteImage(id) {
    const { data } = await await axios({
      method: 'delete',
      url: `${this.path}/${id}`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async getInfo(id) {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/${id}/info`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async pullImage(id) {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/${id}/pull`,
      headers: { authorization: Auth.getToken() },
      timeout: 600000,
    });
    return data;
  }

  async pruneImages() {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/prune`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async clarifyImages() {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/refresh`,
      headers: { authorization: Auth.getToken() },
    });
    return data;
  }

  async loadImages(file) {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await axios({
      method: 'post',
      url: `${this.path}/upload`,
      headers: {
        authorization: Auth.getToken(),
      },
      timeout: 0,
      data: fd,
    });
    return data;
  }

  async downloadImage(id) {
    const { data } = await axios({
      method: 'get',
      url: `${this.path}/${id}/download`,
      headers: { authorization: Auth.getToken() },
      timeout: 0,
    });
    return data;
  }
}

export default new ImagesApi();
