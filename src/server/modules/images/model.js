/* eslint-disable no-restricted-syntax */

import uuid from 'uuid';
import slug from 'slug';
import JSFtp from 'jsftp';
import fs from 'fs';

import { database, docker } from '../../config';
import { crypt } from '../../utils';
import ImageSource, { resources } from '../image-sources/model';

const db = database();

const TABLE = 'images';

export default class Image {
  constructor(args) {
    this.id = args.id || uuid();
    this.name = args.name;
    this.tag = args.tag || 'latest';
    this.slug = slug(`${this.name}:${this.tag}`);
    this.source = args.source || resources.DOCKER_HUB;
  }

  static getImages(showAll = true) {
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

  static getImage(id) {
    const image = Image.findById(id).value();
    if (image) {
      return { image, messages: [] };
    }
    return { image: {}, messages: ['No such image with this id'] };
  }

  static createImage(args) {
    db.read();

    const imagesDb = db.get(TABLE).find({ name: args.name, tag: args.tag }).value();
    if (imagesDb) {
      return { user: {}, messages: ['Image with this name exists'] };
    }

    let image = new Image({ ...args });
    const messages = image.validate();
    if (messages.length === 0) {
      image = image.toJSON();
      db.get(TABLE).push(image).write();
      console.log(db.get(TABLE).value());
      return { image, messages };
    }
    return { image: {}, messages };
  }

  static changeImage(id, args) {
    const imageDb = Image.findById(id);
    if (imageDb.value()) {
      const image = new Image({ ...args, id });
      const messages = image.validate();
      if (messages.length === 0) {
        return {
          image: imageDb.assign({ ...image.toJSON() }).write(),
          messages,
        };
      }
      return { image: {}, messages };
    }
    return { image: {}, messages: ['No such image with this id'] };
  }

  static async removeImage(id) {
    const messages = [];
    const image = Image.findById(id).value();
    if (!image) {
      messages.push('No such image with this id');
    }

    try {
      const dockerImage = await docker.getImage(`${image.name}:${image.tag}`);
      await dockerImage.remove();
    } catch (e) {
      messages.push('Can\'t remove image from host');
      messages.push(e.message);
    }

    return {
      success: db.get(TABLE).remove({ id }).write().length === 1,
      messages,
    };
  }

  static async getInfo(id) {
    const messages = [];
    const image = Image.findById(id).value();
    if (!image) {
      messages.push('No such image with this id');
    }
    try {
      const dockerImage = docker.getImage(`${image.name}:${image.tag}`);
      const info = await dockerImage.inspect();
      return { info, messages };
    } catch (e) {
      return { info: {}, messages: [e.toString()] };
    }
  }

  static pullImage(id, cb) {
    const image = Image.findById(id).value();
    if (!image) {
      cb(null, { success: false, messages: ['No such image with this id'] });
    }

    const source = ImageSource.findById(image.source).value();
    if (source && source.resource === resources.FTP) {
      Image.pullImageFromFtp(image, source, cb);
    } else {
      Image.pullImageFromDocker(image, cb);
    }
  }

  static async pullImageFromDocker(image, cb) {
    try {
      const stream = await docker.pull(`${image.name}:${image.tag}`);
      docker.modem.followProgress(stream, (e, output) => {
        cb(null, { success: true, messages: output });
      });
    } catch (e) {
      cb(e);
    }
  }

  static pullImageFromFtp(image, source, cb) {
    const options = {
      host: source.host,
      port: source.port,
      user: source.user,
      pass: crypt.decrypt(source.password),
    };

    const ftp = new JSFtp(options);

    const imageFilename = `./data/${image.name}_${image.tag}.tar`;
    ftp.get(source.filename, imageFilename, async (err) => {
      if (err) {
        cb(null, { success: false, messages: ['Can\'t fetch file over ftp'] });
      }

      try {
        const stream = await docker.loadImage(imageFilename);
        stream.on('end', () => {
          fs.unlinkSync(imageFilename);
          cb(null, { success: true, messages: ['Image was updated'] });
        });
      } catch (e) {
        cb(null, { success: false, messages: ['Can\'t build image from file', e.message] });
      }
    });
  }

  static async refreshImages() {
    const { messages } = await Image.createImagesFromHost();

    const usedImages = [];
    const images = Image.getImages();
    const dockerImages = await docker.listImages();
    for (const image of images) {
      let usedImage = false;
      for (const dockerImage of dockerImages) {
        if (`${image.name}:${image.tag}` === dockerImage.RepoTags[0]) {
          usedImage = true;
          break;
        }
      }
      if (usedImage) {
        usedImages.push(image);
      }
    }
    db.set(TABLE, usedImages).write();

    return { images: usedImages, messages };
  }

  static async pruneImages() {
    await docker.pruneImages();
    const result = await Image.refreshImages();
    return { images: result.images, messages: result.messages };
  }

  static async createImagesFromHost() {
    const images = [];
    const messages = [];
    const dockerImages = await docker.listImages();
    for (const dockerImage of dockerImages) {
      const repoTags = dockerImage.RepoTags[0].split(':');
      const name = repoTags[0];
      const tag = repoTags[1];
      const image = db.get(TABLE).find({ slug: slug(`${name} ${tag}`) }).value();
      if (!image) {
        const result = Image.createImage({ id: dockerImage.RepoTags[0], name, tag });
        if (result.messages.length === 0) {
          messages.concat(result.messages);
        } else {
          images.push(result.image);
        }
      }
    }
    return { images, messages };
  }

  validate() {
    const messages = [];
    if (!this.name) {
      messages.push('Name is required!');
    }
    return messages;
  }

  toJSON() {
    return { ...this };
  }
}
