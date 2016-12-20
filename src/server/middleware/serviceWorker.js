/* @flow */
/* eslint-disable no-unused-vars */

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import type { $Request, $Response, NextFunction } from 'express';
import { get } from '../../../config';

// Middleware to server our service worker.
function serviceWorkerMiddleware(
  req: $Request, res: $Response, next: NextFunction) {
  res.sendFile(
    pathResolve(
      appRootDir.get(),
      get('bundles', 'client', 'outputPath'),
      get('serviceWorker', 'fileName'),
    ),
  );
}

export default serviceWorkerMiddleware;
