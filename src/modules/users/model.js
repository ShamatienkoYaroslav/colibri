import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import slug from 'slug';

import { constants, database } from '../../config';
import { crypt } from '../../utils';

const db = database();

const TABLE = 'users';

const createToken = id => (jwt.sign({ id }, constants.JWT_SECRET));

export default class User {
  constructor(args) {
    this.id = (args.id) ? args.id : uuid();
    this.name = args.name;
    this.password = crypt.encrypt(args.password);
    this.role = (args.role) ? args.role : 'user';
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

  static createUser(args) {
    db.read();

    const users = db.get(TABLE);

    const userDb = users.find({ name: args.name }).value();
    if (userDb) {
      return { user: {}, messages: ['User with this name exists'] };
    }

    let user = new User({ ...args });
    const messages = user.validate();
    if (messages.length === 0) {
      user = user.toJSON();
      users.push(user).write();
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
      messages.push('No such template with this id');
    }
    return {
      secusses: db.get(TABLE).remove({ id }).write().length === 1,
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
      password: this.password,
      role: this.role,
    };
  }
}
