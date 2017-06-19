/* eslint-disable arrow-body-style */

import low from 'lowdb';
import fse from 'fs-extra';

import constants from './constants';

import { crypt } from '../utils';

const isProd = process.env.NODE_ENV === 'production';

const format = {
  serialize: (obj) => {
    if (isProd) {
      return crypt.encrypt(obj);
    }
    return obj;
  },
  deserialize: (str) => {
    if (isProd) {
      return crypt.decrypt(str);
    }
    return str;
  },
};

const defaultState = {
  user: constants.USER_NAME,
  password: constants.USER_PASSWORD,
};

export default () => {
  fse.ensureFileSync(constants.SETTINGS_FILE);

  const db = low(constants.SETTINGS_FILE, format);
  db.defaults(defaultState).write();
};
