/* eslint-disable no-console*/

import low from 'lowdb';
import fse from 'fs-extra';
import uuid from 'uuid';
import slug from 'slug';

import constants from './constants';
import { crypt } from '../utils';

const user = {
  id: uuid(),
  name: constants.USER_NAME,
  password: crypt.encrypt(constants.USER_PASSWORD),
  role: 'admin',
  slug: slug(constants.USER_NAME),
};

fse.ensureFileSync(constants.DATA_FILE);

const db = low(constants.DATA_FILE);
db.defaults({
  users: [user],
  containers: [],
  imageSources: [],
  images: [],
  templates: [],
  volumes: [],
}).write();

console.log('DB is running');

export default () => (db);
