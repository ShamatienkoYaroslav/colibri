import uuid from 'uuid';
import slug from 'slug';

import { database } from '../../config';
import { crypt } from '../../utils';

const db = database();

const TABLE = 'imageSources';

const resources = {
  DOCKER_HUB: 'docker-hub',
  FTP: 'ftp',
};

class ImageSource {
  constructor(args) {
    this.id = args.id || uuid();
    this.name = args.name;
    this.slug = slug(args.name);
    this.resource = args.resource || resources.DOCKER_HUB;
    this.host = args.host || '';
    this.port = args.port || '';
    this.user = args.user || '';
    this.password = crypt.encrypt(args.password || '');
    this.filename = args.filename || '';
    this.hide = args.hide || false;
  }

  static getImageSources(showAll = true) {
    db.read();
    if (showAll) {
      return db.get(TABLE).value() || [];
    }
    return db.get(TABLE).filter({ hide: false }).value() || [];
  }

  static findById(id) {
    db.read();
    return db.get(TABLE).find({ id });
  }

  static getImageSource(id) {
    const imageSource = ImageSource.findById(id).value();
    if (imageSource) {
      return { source: imageSource, messages: [] };
    }
    return { source: {}, messages: ['No such source with this id'] };
  }

  static createImageSource(args) {
    db.read();

    const imageSourcesDb = db.get(TABLE).find({ name: args.name }).value();
    if (imageSourcesDb) {
      return { user: {}, messages: ['Source with this name exists'] };
    }

    let imageSource = new ImageSource({ ...args });
    const messages = imageSource.validate();
    if (messages.length === 0) {
      imageSource = imageSource.toJSON();
      db.get(TABLE).push(imageSource).write();
      return { source: imageSource, messages };
    }
    return { source: {}, messages };
  }

  static changeImageSource(id, args) {
    const imageSourceDb = ImageSource.findById(id);
    if (imageSourceDb.value()) {
      const imageSource = new ImageSource({ ...args, id });
      const messages = imageSource.validate();
      if (messages.length === 0) {
        return {
          source: imageSourceDb.assign({ ...imageSource.toJSON() }).write(),
          messages,
        };
      }
      return { source: {}, messages };
    }
    return { source: {}, messages: ['No such source with this id'] };
  }

  static removeImageSource(id) {
    const messages = [];
    const imageSource = ImageSource.findById(id).value();
    if (!imageSource) {
      messages.push('No such source with this id');
    }
    return {
      success: db.get(TABLE).remove({ id }).write().length === 1,
      messages,
    };
  }

  validate() {
    const messages = [];
    if (!this.name) {
      messages.push('Name is required!');
    }
    if (this.resource === resources.FTP) {
      if (!this.host) {
        messages.push('Host is required!');
      }
      if (!this.port) {
        messages.push('Port is required!');
      }
      if (!this.user) {
        messages.push('User is required!');
      }
      if (!this.password) {
        messages.push('Password is required!');
      }
      if (!this.filename) {
        messages.push('Filename is required!');
      }
    }
    return messages;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      resource: this.resource,
      host: this.host,
      port: this.port,
      user: this.user,
      password: crypt.decrypt(this.password),
      filename: this.filename,
      hide: this.hide,
    };
  }
}

export { ImageSource as default, resources };
