/* @flow */

// This file resolves the assets available from our client bundle.

import fs from 'fs';
import path from 'path';
import appRoot from 'app-root-path';
import { notEmpty } from '../shared/universal/utils/guards';

const appRootPath = appRoot.toString();

const assetsBundleFilePath = path.resolve(
  appRootPath,
  notEmpty(process.env.BUNDLE_OUTPUT_PATH),
  './client',
  `./${notEmpty(process.env.BUNDLE_ASSETS_FILENAME)}`
);

if (!fs.existsSync(assetsBundleFilePath)) {
  throw new Error(
    `We could not find the "${assetsBundleFilePath}" file, which contains a ` +
    'list of the assets of the client bundle.  Please ensure that the client ' +
    'bundle has been built before the server bundle and that the required ' +
    'environment variables are configured (BUNDLE_OUTPUT_PATH & ' +
    'BUNDLE_ASSETS_FILENAME)'
  );
}

const assetsBundleFileContents = JSON.parse(
  fs.readFileSync(assetsBundleFilePath, 'utf8')
);

// Convert the assets json it into an object that contains all the paths to our
// javascript and css files.  Doing this is required as for production
// configurations we add a hash to our filenames, therefore we won't know the
// paths of the output by webpack unless we read them from the assets.json file.
const assets = Object.keys(assetsBundleFileContents)
  .map(key => assetsBundleFileContents[key])
  .reduce((acc, chunk) => {
    if (chunk.js) {
      acc.scripts.push(chunk.js);
    }
    if (chunk.css) {
      acc.styles.push(chunk.css);
    }
    return acc;
  }, { scripts: [], styles: [] });

// When we are in development mode our development server will generate a
// vendor DLL in order to dramatically reduce our compilation times.  Therefore
// we need to inject the path to the vendor dll bundle below.
// @see /tools/development/ensureVendorDLLExists.js
if (process.env.NODE_ENV === 'development') {
  const vendorPaths = require('../../tools/config/vendorDLLPaths'); // eslint-disable-line global-require

  assets.scripts.splice(0, 0, vendorPaths.dllWebPath);
}

export default assets;
