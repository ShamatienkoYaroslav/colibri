import jwt from 'jsonwebtoken';
import uuid from 'uuid';

import { constants, database } from '../../config';
import { crypt } from '../../utils';

const db = database();

const createToken = user => (jwt.sign({ user }, constants.JWT_SECRET));

export default class User {
  constructor(args) {
    this.id = (args.id) ? args.id : uuid();
    this.name = args.name;
    this.password = crypt.encrypt(args.password);
    this.role = (args.role) ? args.role : 'user';
  }

  static createUser(args) {
    const users = db.get('users');

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
    const userDb = db.get('users').find({ id });
    if (userDb) {
      let user = new User({ ...args, id });
      const messages = user.validate();
      if (messages.length === 0) {
        user = userDb.assign({ ...user.toJSON() }).write();

        return { user, messages };
      }
      return { user: {}, messages };
    }
    return { user: {}, messages: ['No such user with this id'] };
  }

  static checkUser(name, password = null) {
    const user = db.get('users')
      .find({ name })
      .value();

    if (!user) {
      return false;
    } else if (password !== null && crypt.decrypt(user.password) !== password) {
      return false;
    }
    return true;
  }

  static loginUser(name) {
    const user = db.get('users').find({ name }).value();
    return {
      user,
      token: createToken(name),
    };
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
