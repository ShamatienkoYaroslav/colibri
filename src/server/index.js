/* eslint-disable no-console */

import express from 'express';
import path from 'path';

import { constants, middlewares } from './config';
import apiRoutes from './modules';

const app = express();

middlewares(app);
apiRoutes(app);

const isProd = process.env.NODE_ENV === 'production';
let indexHtmlFile = 'dist/index.html';
if (isProd) {
  indexHtmlFile = 'index.html';
}

app.use('/*', (req, res) => {
  res.sendFile(path.resolve(indexHtmlFile));
});

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
