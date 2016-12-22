/* @flow */
/* eslint-disable no-unused-vars */

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import type { $Request, $Response, NextFunction } from 'express';
import config from '../../../config';

// Middleware to server our service worker.
function serviceWorkerMiddleware(
  req: $Request, res: $Response, next: NextFunction) {
  res.sendFile(
    pathResolve(
      appRootDir.get(),
      config.bundles.client.outputPath,
      config.serviceWorker.fileName,
    ),
  );
}

export default serviceWorkerMiddleware;
