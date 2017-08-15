import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Volume from './Volume';
import Volumes from './Volumes';

const VolumesRouter = () => (
  <Switch>
    <Route exact path="/volumes" component={Volumes} />
    <Route path="/volumes/new" component={Volume} />
    <Route path="/volumes/:id" component={Volume} />
  </Switch>
);

export default VolumesRouter;
