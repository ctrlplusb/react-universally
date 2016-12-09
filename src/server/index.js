/* @flow */
/* eslint-disable no-console */

// Support for sourcemaps gives us nice stack traces:
import 'source-map-support/register';
import express from 'express';
import compression from 'compression';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import reactApplication from './middleware/reactApplication';
import security from './middleware/security';
import clientBundle from './middleware/clientBundle';
import serviceWorker from './middleware/serviceWorker';
import errorHandlers from './middleware/errorHandlers';
import projConfig from '../../config/private/project';
import envConfig from '../../config/private/environment';

// Create our express based server.
const app = express();

// Don't expose any software information to potential hackers.
app.disable('x-powered-by');

// Security middlewares.
app.use(...security);

// Gzip compress the responses.
app.use(compression());

// When in production mode, we will serve our service worker which was generated
// by the offline-plugin webpack plugin. See the webpack plugins section for
// more information.
// Note: the service worker needs to be served from the http root of your
// application for it to work correctly.
if (process.env.NODE_ENV === 'production') {
  app.get(`/${projConfig.serviceWorker.fileName}`, serviceWorker);
}

// Configure serving of our client bundle.
app.use(projConfig.bundles.client.webPath, clientBundle);

// Configure static serving of our "public" root http path static files.
// Note: these will be served off the root (i.e. '/') of our application.
app.use(express.static(pathResolve(appRootDir.get(), projConfig.publicAssetsPath)));

// The React application middleware.
app.get('*', reactApplication);

// Error Handler middlewares.
app.use(...errorHandlers);

// Create an http listener for our express app.
const listener = app.listen(envConfig.port, envConfig.host, () =>
  console.log(`Server listening on port ${envConfig.port}`),
);

// We export the listener as it will be handy for our development hot reloader,
// or for exposing a general extension layer for application customisations.
export default listener;
