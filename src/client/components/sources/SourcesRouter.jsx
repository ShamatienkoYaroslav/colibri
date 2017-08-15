import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Source from './Source';
import Sources from './Sources';

const SourcesRouter = () => (
  <Switch>
    <Route exact path="/sources" component={Sources} />
    <Route path="/sources/new" component={Source} />
    <Route path="/sources/:id" component={Source} />
  </Switch>
);

export default SourcesRouter;
