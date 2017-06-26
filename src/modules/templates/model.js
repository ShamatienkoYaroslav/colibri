import uuid from 'uuid';
import slug from 'slug';

import { database } from '../../config';

const db = database();

const TABLE = 'templates';

export default class Template {
  constructor(args) {
    this.id = (args.id) ? args.id : uuid();
    this.image = args.image;
    this.params = args.params;
    this.slug = slug(args.name);
  }

  static getTemplates() {
    return db.get(TABLE).value();
  }

  static findById(id) {
    return db.get(TABLE).find({ id });
  }

  static createTemplate(args) {
    const templates = db.get(TABLE);

    const templateDb = templates.find({ name: args.name }).value();
    if (templateDb) {
      return { user: {}, messages: ['User with this name exists'] };
    }

    let template = new Template({ ...args });
    const messages = template.validate();
    if (messages.length === 0) {
      template = template.toJSON();
      templates.push(template).write();
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
          image: templateDb.assign({ ...template.toJSON() }).write(),
          messages,
        };
      }
      return { image: {}, messages };
    }
    return { image: {}, messages: ['No such template with this id'] };
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

  validate() {
    const messages = [];
    if (!this.image) {
      messages.push('Image is required!');
    }
    if (!this.params) {
      messages.push('Params is required!');
    }
    return messages;
  }

  toJSON() {
    return {
      id: this.id,
      image: this.image,
      params: this.params,
    };
  }
}
