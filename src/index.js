/* eslint-disable no-console */

import express from 'express';

import { constants, middlewares } from './config';
import apiRoutes from './modules';

const app = express();

middlewares(app);
apiRoutes(app);

app.listen(constants.PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`
      Server running on port: ${constants.PORT}
      Running on ${process.env.NODE_ENV}
    `);
  }
});
