/* @flow */

import express from 'express';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import staticConfig from '../../../config/static';

export default express.static(
  pathResolve(appRootDir.get(), staticConfig.clientBundle.outputPath),
  { maxAge: staticConfig.cacheMaxAge },
);
