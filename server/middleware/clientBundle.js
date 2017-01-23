import express from 'express';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import getConfig from '../../config/get';

// Middleware to server our client bundle.
export default express.static(
  pathResolve(appRootDir.get(), getConfig('bundles.client.outputPath')),
  { maxAge: getConfig('browserCacheMaxAge') },
);
