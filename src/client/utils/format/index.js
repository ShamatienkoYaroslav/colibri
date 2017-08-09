import moment from 'moment';

export const formatDate = (date) => {
  if (date) {
    return moment(date).format('M-D-YYYY h:m');
  } else {
    return '';
  }
};