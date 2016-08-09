// This file resolves the assets available from our client bundle.

import fs from 'fs';
import path from 'path';
import appRoot from 'app-root-path';

const appRootPath = appRoot.toString();

const assetsPath = path.resolve(
  appRootPath,
  process.env.CLIENT_BUNDLE_OUTPUT_PATH,
  process.env.CLIENT_BUNDLE_ASSETS_FILENAME
);

if (!fs.existsSync(assetsPath)) {
  throw new Error(
    `We could not find the "${process.env.CLIENT_BUNDLE_ASSETS_FILENAME}" file ` +
    'containing a list of the assets of the client bundle.  Please ensure that ' +
    'the client bundle has been built before the server bundle.'
  );
}

const ClientBundleAssets = JSON.parse(fs.readFileSync(assetsPath, 'utf8'));

// Convert the assets json it into an object that contains all the paths to our
// javascript and css files.  Doing this is required as for production
// configurations we add a hash to our filenames, therefore we won't know the
// paths of the output by webpack unless we read them from the assets.json file.
const chunks = Object.keys(ClientBundleAssets).map(key => ClientBundleAssets[key]);
const assets = chunks.reduce((acc, chunk) => {
  if (chunk.js) {
    acc.scripts.push(chunk.js);
  }
  if (chunk.css) {
    acc.styles.push(chunk.css);
  }
  return acc;
}, { scripts: [], styles: [] });

export default assets;
