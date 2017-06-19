/* eslint-disable no-console*/

import low from 'lowdb';
import fse from 'fs-extra';

import constants from './constants';

export default () => {
  fse.ensureFileSync(constants.DATA_FILE);

  const db = low(constants.DATA_FILE);
  db.defaults({ images: [], starters: [] }).write();

  console.log('DB is running');
};
