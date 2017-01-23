/* eslint-disable no-unused-vars */

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import getConfig from '../../config/get';

// Middleware to server our service worker.
function serviceWorkerMiddleware(req, res, next) {
  res.sendFile(
    pathResolve(
      appRootDir.get(),
      getConfig('bundles.client.outputPath'),
      getConfig('serviceWorker.fileName'),
    ),
  );
}

export default serviceWorkerMiddleware;
