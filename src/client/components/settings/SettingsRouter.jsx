import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Settings from './Settings';
import UsersRouter from './UsersRouter';

const SettingsRouter = () => (
  <Switch>
    <Route exact path="/settings" component={Settings} />
    <Route path="/settings/users" render={() => <UsersRouter />} />
  </Switch>
);

export default SettingsRouter;
