import axios from 'axios';

import UsersApi from './users';
import ContainersApi from './containers';
import ImagesApi from './images';
import SourcesApi from './sources';
import TemplatesApi from './templates';
import VolumesApi from './volumes';

axios.defaults.baseURL = '/api/v1';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export { UsersApi, ContainersApi, ImagesApi, SourcesApi, TemplatesApi, VolumesApi };
