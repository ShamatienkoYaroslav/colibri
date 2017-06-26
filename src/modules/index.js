import users from './users/routes';
import images from './images/routes';
import templates from './templates/routes';
import imageSources from './image-sources/routes';

export default (app) => {
  app.use('/api/v1/user', users);
  app.use('/api/v1/image', images);
  app.use('/api/v1/template', templates);
  app.use('/api/v1/image-sources', imageSources);
};
