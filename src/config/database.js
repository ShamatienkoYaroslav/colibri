/* eslint-disable no-console*/

import low from 'lowdb';
import fse from 'fs-extra';
import uuid from 'uuid';

import constants from './constants';

const user = {
  id: uuid(),
  name: constants.USER_NAME,
  password: '88ec81',
  role: 'admin',
};

fse.ensureFileSync(constants.DATA_FILE);

const db = low(constants.DATA_FILE);
db.defaults({ users: [user], images: [], templates: [], imageSources: [] }).write();

console.log('DB is running');

export default () => (db);
