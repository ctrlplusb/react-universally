/* eslint-disable no-unused-vars */

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import config from '../../config';

// Middleware to server our service worker.
function serviceWorkerMiddleware(req, res, next) {
  res.sendFile(
    pathResolve(
      appRootDir.get(),
      config('bundles.client.outputPath'),
      config('serviceWorker.fileName'),
    ),
  );
}

export default serviceWorkerMiddleware;
