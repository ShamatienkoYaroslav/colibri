/* eslint-disable no-restricted-syntax */

import uuid from 'uuid';
import slug from 'slug';
import JSFtp from 'jsftp';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

import { database, docker } from '../../config';
import { crypt } from '../../utils';
import constants from '../../config/constants';
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
    this.hide = args.hide || false;
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
      return { success: false, messages };
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
        stream.on('data', (chunk) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Received ${chunk.length} bytes of data.`);
          }
        });
        stream.on('end', () => {
          fs.unlinkSync(imageFilename);
          cb(null, { success: true, messages: [] });
        });
      } catch (e) {
        cb(null, { success: false, messages: ['Can\'t build image from file', e.message] });
      }
    });
  }

  static pullImageFromFile(filename, cb) {
    Image.loadImagefromFile(path.join(constants.UPLOAD_DIR, filename))
      .then(async () => {
        const result = await Image.refreshImages(true);
        cb(null, { images: result.images, messages: result.messages });
      })
      .catch(e => cb(null, { images: [], messages: ['Can\'t load image from file', e.message] }));
  }

  static async refreshImages(createImages = true) {
    let messages = [];
    if (createImages) {
      const result = await Image.createImagesFromHost();
      messages = result.messages;
    }

    const usedImages = [];
    const images = Image.getImages();
    try {
      const dockerImages = await docker.listImages();
      for (const image of images) {
        let usedImage = false;
        for (const dockerImage of dockerImages) {
          if (dockerImage.RepoTags) {
            for (const imageRT of dockerImage.RepoTags) {
              if (`${image.name}:${image.tag}` === imageRT) {
                usedImage = true;
                break;
              }
            }
          }
        }
        if (usedImage) {
          usedImages.push(image);
        }
      }
      db.set(TABLE, usedImages).write();
    } catch (e) {
      messages.push(e.toString());
    }
    return { images: usedImages, messages };
  }

  static async pruneImages() {
    await docker.pruneImages();
    const result = await Image.refreshImages(false);
    return { images: result.images, messages: result.messages };
  }

  static async createImagesFromHost() {
    const images = [];
    const messages = [];
    try {
      const dockerImages = await docker.listImages();
      for (const dockerImage of dockerImages) {
        if (dockerImage.RepoTags) {
          for (const imageRT of dockerImage.RepoTags) {
            const repoTags = imageRT.split(':');
            const name = repoTags[0];
            const tag = repoTags[1];
            const image = db.get(TABLE).find({ slug: slug(`${name}:${tag}`) }).value();
            if (!image) {
              const result = Image.createImage({ name, tag });
              if (result.messages.length === 0) {
                messages.concat(result.messages);
              } else {
                images.push(result.image);
              }
            }
          }
        }
      }
    } catch (e) {
      messages.push(e.toString());
    }
    return { images, messages };
  }

  static loadImagefromFile(filename) {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await docker.loadImage(filename);
        stream.on('data', (chunk) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Received ${chunk.length} bytes of data.`);
          }
        });
        stream.on('end', () => {
          fs.unlinkSync(filename);
          resolve();
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }

  static getFileToDownloadImage(id) {
    return new Promise(async (resolve) => {
      let filename = null;
      const messages = [];
      const image = Image.findById(id).value();
      if (!image) {
        messages.push('No such image with this id');
        return { success: false, messages };
      }

      try {
        const imageName = `${image.name}:${image.tag}`;
        filename = path.join(constants.UPLOAD_DIR, `${imageName}.tar`);
        fse.ensureFileSync(filename);
        const writeStream = fs.createWriteStream(filename);
        
        const dockerImage = docker.getImage(imageName);
        const stream = await dockerImage.get();
        stream.pipe(writeStream, { end: true });
        stream.on('data', (chunk) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Received ${chunk.length} bytes of data.`);
          }
        });
        stream.on('end', () => {
          resolve({ filename, messages });
        });
      } catch (e) {
        messages.push(e.toString());
        resolve({ filename, messages });
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
    return { ...this };
  }
}
