import express from 'express';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export default (app) => {
  if (isProd) {
    app.use(compression());
    app.use(helmet());
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.set('view engine', 'html');

  let staticPath = './dist';
  if (isProd) {
    staticPath = './';
  }
  app.use(express.static(path.join(staticPath)));

  if (isDev) {
    app.use(morgan('dev'));
  }
};
