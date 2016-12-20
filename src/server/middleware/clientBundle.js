/* @flow */

import express from 'express';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import { get } from '../../../config';

// Middleware to server our client bundle.
export default express.static(
  pathResolve(appRootDir.get(), get('bundles', 'client', 'outputPath')),
  { maxAge: get('browserCacheMaxAge') },
);
