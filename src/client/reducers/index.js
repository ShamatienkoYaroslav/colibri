import { combineReducers } from 'redux';

import users from './users';
import images from './images';
import templates from './templates';

export const updateData = (data, record) => {
  const newData = data.filter(item => (item.id !== record.id));
  newData.push(record);
  return newData;
};

export default combineReducers({
  users,
  images,
  templates,
});
