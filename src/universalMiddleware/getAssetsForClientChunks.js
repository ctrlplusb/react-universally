/* @flow */

// This file resolves the assets available from our client bundle.

import fs from 'fs';
import path from 'path';
import appRoot from 'app-root-dir';
import { notEmpty } from '../shared/universal/utils/guards';

const appRootPath = appRoot.get();

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

const assetsJSON = JSON.parse(
  fs.readFileSync(assetsBundleFilePath, 'utf8')
);

/**
 * Retrieves the js/css for the given chunks that belong to our client bundle.
 *
 * Note: the order of the chunk names is important. The same ordering will be
 * used when rendering the scripts.
 *
 * This is useful to us for a couple of reasons:
 *   - It allows us to target the assets for a specific chunk, thereby only
 *     loading the assets we know we will need for a specific request.
 *   - The assets are hashed, and therefore they can't be "manually" added
 *     to the render logic.  Having this method allows us to easily fetch
 *     the respective assets simply by using a chunk name. :)
 */
function getAssetsForClientChunks(chunks: Array<string>) {
  return chunks.reduce((acc, chunkName) => {
    const chunkAssets = assetsJSON[chunkName];
    if (chunkAssets) {
      if (chunkAssets.js) {
        acc.js.push(chunkAssets.js);
      }
      if (chunkAssets.css) {
        acc.css.push(chunkAssets.css);
      }
    }
    return acc;
  }, { js: [], css: [] });
}

export default getAssetsForClientChunks;
