import multer from 'multer';

import constants from '../config/constants';

const upload = multer({ dest: constants.UPLOAD_DIR }).single('image');

export default upload;
