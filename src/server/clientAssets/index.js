/* @flow */

// This file resolves the assets available from our client bundle.

import fs from 'fs';
import { CLIENT_BUNDLE_ASSETSJSON_FILEPATH } from '../config';

const ClientBundleAssets = JSON.parse(
  fs.readFileSync(CLIENT_BUNDLE_ASSETSJSON_FILEPATH, 'utf8')
);

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
