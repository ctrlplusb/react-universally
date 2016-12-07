/* @flow */
/* eslint-disable no-unused-vars */

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import type { $Request, $Response, NextFunction } from 'express';
import projConfig from '../../../config/private/project';

// Middleware to server our service worker.
function serviceWorkerMiddleware(
  req: $Request, res: $Response, next: NextFunction) {
  res.sendFile(
    pathResolve(
      appRootDir.get(),
      projConfig.bundles.client.outputPath,
      projConfig.serviceWorker.fileName,
    ),
  );
}

export default serviceWorkerMiddleware;
