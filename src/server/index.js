/* @flow */

// This grants us source map support, which combined with our webpack source
// maps will give us nice stack traces.
import 'source-map-support/register';
import path from 'path';
import appRoot from 'app-root-path';
import express from 'express';
import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import { getEnvVar } from '../shared/node/utils/env';

const appRootPath = appRoot.toString();

// Create our express based server.
const app = express();

// Don't expose any software information to hackers.
app.disable('x-powered-by');

// Prevent HTTP Parameter pollution.
app.use(hpp());

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'"],
  imgSrc: ["'self'"],
  connectSrc: ["'self'", 'ws:'],
  fontSrc: ["'self'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'none'"],
  frameSrc: ["'none'"],
}));
app.use(helmet.xssFilter());
app.use(helmet.frameguard('deny'));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());

// Response compression.
app.use(compression());

// Configure static serving of our webpack bundled client files.
app.use(
  getEnvVar('CLIENT_BUNDLE_HTTP_PATH'),
  express.static(
    path.resolve(appRootPath, getEnvVar('BUNDLE_OUTPUT_PATH'), './client'),
    { maxAge: getEnvVar('CLIENT_BUNDLE_CACHE_MAXAGE') }
  )
);

// Configure static serving of our "public" root http path static files.
app.use(express.static(path.resolve(appRootPath, './public')));

// Bind our universal react app middleware as the handler for all get requests.
if (process.env.NODE_ENV === 'development') {
  // In development mode we will use a special wrapper middleware which will
  // allow us to flush our node module cache effectively, and it will thereby
  // allow us to "hot" reload any builds/updates to our middleware.
  const universalDevMiddleware = require('../../tools/development/universalDevMiddleware'); // eslint-disable-line global-require,max-len

  app.get('*', universalDevMiddleware);
} else {
  const universalMiddleware = require('../universalMiddleware').default; // eslint-disable-line global-require,max-len

  app.get('*', universalMiddleware);
}

const port = parseInt(getEnvVar('SERVER_PORT'), 10);

// Create an http listener for our express app.
const listener = app.listen(port);

console.log(`==> 💚  HTTP Listener is running on port ${port}`); // eslint-disable-line no-console,max-len

// We export the listener as it will be handy for our development hot reloader.
export default listener;
