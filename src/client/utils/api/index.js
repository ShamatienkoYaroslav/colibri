import axios from 'axios';

import UsersApi from './users';
import ImagesApi from './images';
import TemplatesApi from './templates';

axios.defaults.baseURL = 'http://localhost:5000/api/v1';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export { UsersApi, ImagesApi, TemplatesApi };
