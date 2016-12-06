/* @flow */

import express from 'express';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import projConfig from '../../../config/project';

export default express.static(
  pathResolve(appRootDir.get(), projConfig.bundles.client.outputPath),
  { maxAge: projConfig.browserCacheMaxAge },
);
