import crypto from 'crypto';

import constants from '../config/constants';

const toString = (data) => {
  let str = data;
  if (typeof str !== 'string') {
    str = JSON.stringify(str);
  }

  return str;
};

const encrypt = (data) => {
  const cipher = crypto.createCipher(constants.CRYPTO_ALGORITM, constants.CRYPTO_PASSWORD);
  let crypted = cipher.update(toString(data), 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

const decrypt = (str) => {
  const decipher = crypto.createDecipher(constants.CRYPTO_ALGORITM, constants.CRYPTO_PASSWORD);
  let dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

export default { encrypt, decrypt };
