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
    this.id = (args.id) ? args.id : uuid();
    this.name = args.name;
    this.tag = (args.tag) ? args.tag : 'latest';
    this.slug = slug(`${this.name} ${this.tag}`);
    this.source = args.source || resources.DOCKER_HUB;
  }

  static getImages() {
    const result = [];
    const images = db.get(TABLE);
    for (const image of images) {
      result.push(new Image({ ...image }).toJSON());
    }
    return result;
  }

  static findById(id) {
    return db.get(TABLE).find({ id });
  }

  static createImage(args) {
    const images = db.get(TABLE);

    const imagesDb = images.find({ name: args.name }).value();
    if (imagesDb) {
      return { user: {}, messages: ['Image with this name exists'] };
    }

    let image = new Image({ ...args });
    const messages = image.validate();
    if (messages.length === 0) {
      image = image.toJSON();
      images.push(image).write();
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

  static removeImage(id) {
    const messages = [];
    const image = Image.findById(id).value();
    if (!image) {
      messages.push('No such image with this id');
    }
    return {
      secusses: db.get(TABLE).remove({ id }).write().length === 1,
      messages,
    };
  }

  static async getInfo(id) {
    const messages = [];
    const image = Image.findById(id).value();
    if (!image) {
      messages.push('No such image with this id');
    }
    const dockerImage = docker.getImage(`${image.name}:${image.tag}`);
    const info = await dockerImage.inspect();
    return { info, messages };
  }

  static pullImage(id, cb) {
    const image = Image.findById(id).value();
    if (!image) {
      cb(null, { secusses: false, messages: ['No such image with this id'] });
    }

    const source = ImageSource.findById(image.source).value();
    if (source) {
      if (source.resource === resources.FTP) {
        Image.pullImageFromFtp(image, source, cb);
      } else {
        Image.pullImageFromDocker(image, cb);
      }
    }
  }

  static async pullImageFromDocker(image, cb) {
    try {
      const stream = await docker.pull(`${image.name}:${image.tag}`);
      docker.modem.followProgress(stream, (e, output) => {
        cb(null, { secusses: true, messages: output });
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
        cb(null, { secusses: false, messages: ['Can\'t fetch file over ftp'] });
      }

      try {
        const data = fs.createReadStream(imageFilename);
        const stream = await docker.importImage(data, {});
        stream.on('end', () => {
          console.log(333);
          // fs.unlinkSync(imageFilename);
          cb(null, { secusses: true, messages: ['Image was updated'] });
        });
      } catch (e) {
        console.error(e);
        cb(null, { secusses: false, messages: ['Can\'t build image from file'] });
      }
    });
  }

  validate() {
    const messages = [];
    if (!this.name) {
      messages.push('Name is required!');
    }
    return messages;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tag: this.tag,
      slug: this.slug,
      source: this.source,
    };
  }
}
