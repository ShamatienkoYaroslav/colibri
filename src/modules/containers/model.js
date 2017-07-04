/* eslint-disable no-restricted-syntax */

import uuid from 'uuid';
import slug from 'slug';

import { database, docker } from '../../config';
import Template from '../templates/model';
import Image from '../images/model';

const db = database();

const TABLE = 'containers';

const ContainerStatus = {
  RUNNIG: 'runnig',
  STOPPED: 'stopped',
  EXISTS: 'created',
  LACKING: 'lacking',
};

export default class Container {
  constructor(args) {
    this.id = args.id || uuid();
    this.name = args.name;
    this.template = args.template;
    this.status = args.status || ContainerStatus.LACKING;
    this.containerId = args.containerId || '';
    this.auto = args.auto || false; // created from host
    this.image = args.image || '';
    this.slug = slug(this.name);
    this.hide = args.hide || false;
  }

  static getContainers(showAll = true) {
    db.read();
    if (showAll) {
      return db.get(TABLE).value();
    }
    return db.get(TABLE).filter({ hide: false }).value();
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
      container.image = template.image;

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

        container.status = ContainerStatus.EXISTS;
        container.containerId = containerDocker.id;
      } catch (e) {
        return { container: {}, messages: ['Can\'t create container', e.message] };
      }

      db.get(TABLE).push(container).write();

      return { container, messages };
    }
    return { container: {}, messages };
  }

  static createContainerFromHost(args) {
    db.read();

    const containerDb = db.get(TABLE).find({ name: args.name }).value();
    if (containerDb) {
      return { container: {}, messages: ['Container with this name exists'] };
    }

    let container = new Container({ ...args, auto: true });
    const messages = container.validate();
    if (messages.length === 0) {
      container = container.toJSON();
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
    if (status === ContainerStatus.RUNNIG) {
      return { container, messages: ['Container is already running'] };
    } else if (!status || status === ContainerStatus.LACKING) {
      return { container, messages: ['Container isn\'t created on host'] };
    }

    try {
      await docker.getContainer(containerId).start();

      container.status = ContainerStatus.RUNNIG;
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
    if (status === ContainerStatus.STOPPED) {
      return { container, messages: ['Container is already stopped'] };
    } else if (!status || status === ContainerStatus.LACKING) {
      return { container, messages: ['Container isn\'t created on host'] };
    }

    try {
      await docker.getContainer(containerId).stop();

      container.status = ContainerStatus.STOPPED;
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
    const { messages } = await Container.createContainersFromHost();

    const usedContainers = [];
    const containers = Container.getContainers();
    const dockerContainers = await docker.listContainers({ all: true });
    for (const container of containers) {
      let usedContainer = false;
      for (const dockerContainer of dockerContainers) {
        if (`/${container.slug}` === dockerContainer.Names[0]) {
          usedContainer = true;
          break;
        }
      }
      if (usedContainer) {
        usedContainers.push(container);
      }
    }
    db.set(TABLE, usedContainers).write();

    return { containers: usedContainers, messages };
  }

  static async pruneContainers() {
    const result = await docker.pruneContainers();
    await Container.efreshContainers();
    return { cleaned: result.ContainersDeleted };
  }

  static async createContainersFromHost() {
    db.read();

    const messages = [];
    const dockerContainers = await docker.listContainers({ all: true });
    for (const dockerContainer of dockerContainers) {
      const name = dockerContainer.Names[0].split('/')[1].replace(/-/g, ' ');
      const result = Container.createContainerFromHost({
        name,
        image: dockerContainer.Image,
        status: dockerContainer.State,
        containerId: dockerContainer.Id,
      });
      if (result.messages.length === 0) {
        messages.concat(result.messages);
      }
    }
    return { messages };
  }

  validate() {
    const messages = [];
    if (!this.name) {
      messages.push('Name is required!');
    }
    if (!this.auto && !this.template) {
      messages.push('Template is required!');
    }
    return messages;
  }

  toJSON() {
    return { ...this };
  }
}
