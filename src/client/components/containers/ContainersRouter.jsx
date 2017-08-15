import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Container from './Container';
import Containers from './Containers';

const ContainersRouter = () => (
  <Switch>
    <Route exact path="/containers" component={Containers} />
    <Route path="/containers/new" component={Container} />
    <Route path="/containers/:id" component={Container} />
  </Switch>
);

export default ContainersRouter;
