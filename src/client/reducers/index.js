import { combineReducers } from 'redux';

import users from './users';
import containers from './containers';
import images from './images';
import sources from './sources';
import templates from './templates';
import volumes from './volumes';

export const updateData = (data, record) => {
  const newData = data.filter(item => (item.id !== record.id));
  newData.push(record);
  return newData;
};

export default combineReducers({
  users,
  containers,
  images,
  sources,
  templates,
  volumes,
});
