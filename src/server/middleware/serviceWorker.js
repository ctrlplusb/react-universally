/* @flow */
/* eslint-disable no-unused-vars */

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import type { $Request, $Response, NextFunction } from 'express';
import staticConfig from '../../../config/static';

function serviceWorkerMiddleware(
  req: $Request, res: $Response, next: NextFunction) {
  res.sendFile(
    pathResolve(
      appRootDir.get(),
      staticConfig.clientBundle.outputPath,
      staticConfig.serviceWorker.fileName,
    ),
  );
}

export default serviceWorkerMiddleware;
