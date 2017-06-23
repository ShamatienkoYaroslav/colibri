import users from './users/routes';

export default (app) => {
  app.use('/api/v1/user', users);
};
