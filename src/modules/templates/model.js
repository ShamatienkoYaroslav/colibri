/* eslint-disable no-restricted-syntax */

import uuid from 'uuid';
import slug from 'slug';

import { database } from '../../config';
import Image from '../images/model';
import Volume from '../volumes/model';

const db = database();

const TABLE = 'templates';

export default class Template {
  constructor(args) {
    this.id = args.id || uuid();
    this.name = args.name;
    this.image = args.image;
    this.config = args.config; // https://docs.docker.com/engine/api/v1.30/#operation/ContainerCreate
    this.volumes = args.volumes || [];
    this.slug = slug(args.name);
  }

  static getTemplates() {
    db.read();
    return db.get(TABLE).value();
  }

  static findById(id) {
    db.read();
    return db.get(TABLE).find({ id });
  }

  static createTemplate(args) {
    db.read();

    const templateDb = db.get(TABLE).find({ name: args.name }).value();
    if (templateDb) {
      return { template: {}, messages: ['Template with this name exists'] };
    }

    let template = new Template({ ...args });
    const messages = template.validate();
    if (messages.length === 0) {
      template = template.toJSON();
      db.get(TABLE).push(template).write();
      return { template, messages };
    }
    return { template: {}, messages };
  }

  static changeTemplate(id, args) {
    const templateDb = Template.findById(id);
    if (templateDb.value()) {
      const template = new Template({ ...args, id });
      const messages = template.validate();
      if (messages.length === 0) {
        return {
          template: templateDb.assign({ ...template.toJSON() }).write(),
          messages,
        };
      }
      return { template: {}, messages };
    }
    return { template: {}, messages: ['No such template with this id'] };
  }

  static removeTemplate(id) {
    const messages = [];
    const template = Template.findById(id).value();
    if (!template) {
      messages.push('No such template with this id');
    }
    return {
      secusses: db.get(TABLE).remove({ id }).write().length === 1,
      messages,
    };
  }

  static refreshTemplates() {
    const workingTemplates = [];
    const cleanedTemplates = [];
    const images = Image.getImages();
    const templates = Template.getTemplates();
    for (const template of templates) {
      let imageUsed = false;
      for (const image of images) {
        if (image.id === template.image) {
          imageUsed = true;
        }
      }

      if (imageUsed) {
        workingTemplates.push(template);
      } else {
        cleanedTemplates.push(template);
      }
    }
    db.set(TABLE, workingTemplates).write();

    return { templates: workingTemplates, cleaned: cleanedTemplates };
  }

  static getBinds(template) {
    const binds = [];
    for (let i = 0; i < template.volumes.length; i += 1) {
      const volume = Volume.findById(template.volumes[i]).value();
      if (volume) {
        binds.push(Volume.getBinds(volume));
      }
    }
    return binds;
  }

  validate() {
    const messages = [];
    if (!this.name) {
      messages.push('Name is required!');
    }
    if (!this.image) {
      messages.push('Image is required!');
    }
    return messages;
  }

  toJSON() {
    return { ...this };
  }
}
