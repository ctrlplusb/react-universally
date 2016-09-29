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
import universalMiddleware from '../universalMiddleware';
import { notEmpty } from '../shared/universal/utils/guards';

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
  notEmpty(process.env.CLIENT_BUNDLE_HTTP_PATH),
  express.static(
    path.resolve(appRootPath, notEmpty(process.env.BUNDLE_OUTPUT_PATH), './client'),
    { maxAge: notEmpty(process.env.CLIENT_BUNDLE_CACHE_MAXAGE) }
  )
);

// Configure static serving of our "public" root http path static files.
app.use(express.static(path.resolve(appRootPath, './public')));

// Bind our universal react app middleware as the handler for all get requests.
if (process.env.NODE_ENV === 'development') {
  // In development mode we will use a special wrapper middleware which will
  // allow us to flush our node module cache effectively, and it will thereby
  // allow us to "hot" reload any builds/updates to our middleware bundle.
  const universalDevMiddleware = require('../../tools/development/universalDevMiddleware'); // eslint-disable-line global-require,max-len

  app.get('*', universalDevMiddleware);
} else {
  app.get('*', universalMiddleware);
}

// Create an http listener for our express app.
const port = parseInt(notEmpty(process.env.SERVER_PORT), 10);
const listener = app.listen(port);
console.log(`Server listening on port ${port}`); // eslint-disable-line no-console

// We export the listener as it will be handy for our development hot reloader.
export default listener;
