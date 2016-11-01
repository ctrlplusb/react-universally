/* @flow */
/* eslint-disable no-console */

// This grants us source map support, which combined with our webpack source
// maps will give us nice stack traces.
import 'source-map-support/register';
import path from 'path';
import appRoot from 'app-root-path';
import express from 'express';
import type { $Request, $Response, NextFunction } from 'express';
import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import universalMiddleware from './middleware/universalMiddleware';
import { notEmpty } from '../shared/universal/utils/guards';

const appRootPath = appRoot.toString();

// Create our express based server.
const app = express();

// Don't expose any software information to hackers.
app.disable('x-powered-by');

// Prevent HTTP Parameter pollution.
app.use(hpp());

// Content Security Policy
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'cdn.polyfill.io'],
    styleSrc: ["'self'", "'unsafe-inline'", 'blob:'],
    imgSrc: ["'self'", 'data:'],
    connectSrc: ["'self'", 'ws:'],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'none'"],
    childSrc: ["'self'"],
  },
};
if (process.env.NODE_ENV === 'development') {
  // When in development mode we need to add our secondary express server that
  // is used to host our client bundle to our csp config.
  Object.keys(cspConfig.directives).forEach(directive =>
    cspConfig.directives[directive].push(
      `localhost:${notEmpty(process.env.CLIENT_DEVSERVER_PORT)}`
    )
  );
}
app.use(helmet.contentSecurityPolicy(cspConfig));
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

// When in production mode, bind our service worker folder so that it can
// be served.
// Note: the service worker needs to be available at the http root of your
// application for the offline support to work.
if (process.env.NODE_ENV === 'production') {
  app.use(
    express.static(
      path.resolve(appRootPath, notEmpty(process.env.BUNDLE_OUTPUT_PATH), './serviceWorker')
    )
  );
}

// The universal middleware for our React application.
app.get('*', universalMiddleware);

// Handle 404 errors.
// Note: the react application middleware hands 404 paths, but it is good to
// have this backup for paths not handled by the universal middleware. For
// example you may bind a /api path to express.
app.use((req: $Request, res: $Response, next: NextFunction) => { // eslint-disable-line no-unused-vars,max-len
  res.status(404).send('Sorry, that resource was not found.');
});

// Handle all other errors (i.e. 500).
// Note: You must provide specify all 4 parameters on this callback function
// even if they aren't used, otherwise it won't be used.
app.use((err: ?Error, req: $Request, res: $Response, next: NextFunction) => { // eslint-disable-line no-unused-vars,max-len
  if (err) {
    console.log(err);
    console.log(err.stack);
  }
  res.status(500).send('Sorry, an unexpected error occurred.');
});

// Create an http listener for our express app.
const port = parseInt(notEmpty(process.env.SERVER_PORT), 10);
const listener = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);

// We export the listener as it will be handy for our development hot reloader.
export default listener;
