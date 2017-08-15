import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Image from './Image';
import Images from './Images';

const ImagesRouter = () => (
  <Switch>
    <Route exact path="/images" component={Images} />
    <Route path="/images/new" component={Image} />
    <Route path="/images/:id" component={Image} />
  </Switch>
);

export default ImagesRouter;