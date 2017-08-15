import React from 'react';
import { Switch, Route } from 'react-router-dom';

import User from './User';
import Users from './Users';

const UsersRouter = () => (
  <Switch>
    <Route exact path="/settings/users" component={Users} />
    <Route path="/settings/users/new" component={User} />
    <Route path="/settings/users/:id" component={User} />
  </Switch>
);

export default UsersRouter;
