/* eslint-disable no-restricted-syntax */

import uuid from 'uuid';
import slug from 'slug';
import settle from 'promise-settle';

import { database, docker } from '../../config';
import Template from '../templates/model';
import Image from '../images/model';

const db = database();

const TABLE = 'containers';

const containerStatus = {
  RUNNIG: 'runnig',
  STOPPED: 'stopped',
  EXISTS: 'exists',
  LACKING: 'lacking',
};

export default class Container {
  constructor(args) {
    this.id = args.id || uuid();
    this.name = args.name;
    this.template = args.template;
    this.status = containerStatus.LACKING;
    this.containerId = '';
    this.slug = slug(this.name);
  }

  static getContainers() {
    db.read();
    return db.get(TABLE).value();
  }

  static findById(id) {
    db.read();
    return db.get(TABLE).find({ id });
  }

  static async createContainer(args) {
    db.read();

    const containerDb = db.get(TABLE).find({ name: args.name }).value();
    if (containerDb) {
      return { container: {}, messages: ['Container with this name exists'] };
    }

    let container = new Container({ ...args });
    const messages = container.validate();
    if (messages.length === 0) {
      container = container.toJSON();

      const template = Template.findById(container.template).value();
      if (!template) {
        return { container: {}, messages: ['Can\'t find template'] };
      }
      const image = Image.findById(template.image).value();
      if (!image) {
        return { container: {}, messages: ['Can\'t find image'] };
      }

      try {
        const opts = {
          Image: `${image.name}:${image.tag}`,
          name: container.slug,
          HostConfig: {
            ...template.config.HostConfig,
            Binds: Template.getBinds(template),
          },
        };
        const containerDocker = await docker.createContainer(opts);

        container.status = containerStatus.EXISTS;
        container.containerId = containerDocker.id;
      } catch (e) {
        return { container: {}, messages: ['Can\'t create container', e.message] };
      }

      db.get(TABLE).push(container).write();

      return { container, messages };
    }
    return { container: {}, messages };
  }

  static changeContainer(id, args) {
    const containerDb = Container.findById(id);
    if (containerDb.value()) {
      const container = new Container({ ...args, id });
      const messages = container.validate();
      if (messages.length === 0) {
        return {
          container: containerDb.assign({ ...container.toJSON() }).write(),
          messages,
        };
      }
      return { container: {}, messages };
    }
    return { container: {}, messages: ['No such container with this id'] };
  }

  static async startContainer(id) {
    const container = Container.findById(id).value();
    if (!container) {
      return { container: {}, messages: ['Can\'t find container'] };
    }

    const { status, containerId } = container;
    if (status === containerStatus.RUNNIG) {
      return { container, messages: ['Container is already running'] };
    } else if (!status || status === containerStatus.LACKING) {
      return { container, messages: ['Container isn\'t created on host'] };
    }

    try {
      await docker.getContainer(containerId).start();

      container.status = containerStatus.RUNNIG;
      db.get(TABLE).find({ id }).assign(container).write();

      return { container, messages: [] };
    } catch (e) {
      return { container: {}, messages: ['Can\'t start container', e.message] };
    }
  }

  static async stopContainer(id) {
    const container = Container.findById(id).value();
    if (!container) {
      return { container: {}, messages: ['Can\'t find container'] };
    }

    const { status, containerId } = container;
    if (status === containerStatus.STOPPED) {
      return { container, messages: ['Container is already stopped'] };
    } else if (!status || status === containerStatus.LACKING) {
      return { container, messages: ['Container isn\'t created on host'] };
    }

    try {
      await docker.getContainer(containerId).stop();

      container.status = containerStatus.STOPPED;
      db.get(TABLE).find({ id }).assign(container).write();

      return { container, messages: [] };
    } catch (e) {
      return { container: {}, messages: ['Can\'t stop container', e.message] };
    }
  }

  static async removeContainer(id) {
    const container = Container.findById(id).value();
    if (!container) {
      return { secusses: false, messages: ['Can\'t find container'] };
    }

    try {
      const containerDocker = await docker.getContainer(container.containerId);
      const info = await containerDocker.inspect();
      if (info.State.Status === 'running') {
        await containerDocker.stop();
      }
      await containerDocker.remove();

      return { secusses: db.get(TABLE).remove({ id }).write().length === 1, messages: [] };
    } catch (e) {
      return { secusses: false, messages: ['Can\'t remove container', e.message] };
    }
  }

  static async refreshContainers() {
    const inspects = [];
    const cleanedContainers = [];
    const workingContainers = [];
    const containers = Container.getContainers();
    for (const container of containers) {
      const dockerContainer = docker.getContainer(container.containerId);
      inspects.push(dockerContainer.inspect());
    }

    if (inspects.length === 0) {
      return { images: [] };
    }

    const results = await settle(inspects);
    const stContainersDb = [...containers];
    for (const result of results) {
      const containerDb = stContainersDb[results.indexOf(result)];
      if (result.isFulfilled()) {
        workingContainers.push(containerDb);
      } else {
        cleanedContainers.push(containerDb);
      }
    }
    db.set(TABLE, workingContainers).write();

    return { containers: workingContainers, cleaned: cleanedContainers };
  }

  static async pruneContainers() {
    const result = await docker.pruneContainers();
    await Container.efreshContainers();
    return { cleaned: result.ContainersDeleted };
  }

  validate() {
    const messages = [];
    if (!this.name) {
      messages.push('Name is required!');
    }
    if (!this.template) {
      messages.push('Template is required!');
    }
    return messages;
  }

  toJSON() {
    return { ...this };
  }
}
