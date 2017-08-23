import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import slug from 'slug';

import { constants, database } from '../../config';
import { crypt } from '../../utils';

const db = database();

const TABLE = 'users';

const Roles = {
  ADMIN: 'admin',
  CHANGE: 'change',
};

const createToken = id => (jwt.sign({ id }, constants.JWT_SECRET));

export default class User {
  constructor(args) {
    this.id = args.id || uuid();
    this.name = args.name;
    this.password = crypt.encrypt(args.password);
    this.role = args.role || Roles.CHANGE;
    this.slug = slug(args.name);
  }

  static getUsers() {
    db.read();
    return db.get(TABLE).value();
  }

  static findById(id) {
    db.read();
    return db.get(TABLE).find({ id });
  }

  static findByName(name) {
    db.read();
    return db.get(TABLE).find({ name });
  }

  static getUser(id) {
    const user = User.findById(id).value();
    if (user) {
      return { user, messages: [] };
    }
    return { user: {}, messages: ['No such user with this id'] };
  }

  static createUser(args) {
    db.read();

    const userDb = db.get(TABLE).find({ name: args.name }).value();
    if (userDb) {
      return { user: {}, messages: ['User with this name exists'] };
    }

    let user = new User({ ...args });
    const messages = user.validate();
    if (messages.length === 0) {
      const password = user.password;
      user = user.toJSON();
      db.get(TABLE).push({ ...user, password }).write();
      return { user, messages };
    }
    return { user: {}, messages };
  }

  static changeUser(id, args) {
    const userDb = User.findById(id);
    if (userDb.value()) {
      const user = new User({ ...args, id });
      const messages = user.validate();
      if (messages.length === 0) {
        return {
          user: userDb.assign({ ...user.toJSON() }).write(),
          messages,
        };
      }
      return { user: {}, messages };
    }
    return { user: {}, messages: ['No such user with this id'] };
  }

  static removeUser(id) {
    const messages = [];
    const user = User.findById(id).value();
    if (!user) {
      messages.push('No such user with this id');
    }
    return {
      success: db.get(TABLE).remove({ id }).write().length === 1,
      messages,
    };
  }

  static checkUser(name, password) {
    const user = User.findByName(name);

    if (!user) {
      return false;
    } else if (crypt.decrypt(user.password) !== password) {
      return false;
    }
    return true;
  }

  static loginUser(user) {
    return {
      user,
      token: `JWT ${createToken(user.id)}`,
    };
  }

  static authenticateUser(user, password) {
    return crypt.decrypt(user.password) === password;
  }

  static userIsAdmin(user) {
    return user.role === Roles.ADMIN;
  }

  validate() {
    const messages = [];
    if (!this.name) {
      messages.push('Name is required!');
    }
    if (!this.password) {
      messages.push('Password is required!');
    }
    return messages;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      slug: this.slug,
    };
  }
}
