import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Template from './Template';
import Templates from './Templates';

const TemplatesRouter = () => (
  <Switch>
    <Route exact path="/templates" component={Templates} />
    <Route path="/templates/new" component={Template} />
    <Route path="/templates/:id" component={Template} />
  </Switch>
);

export default TemplatesRouter;
