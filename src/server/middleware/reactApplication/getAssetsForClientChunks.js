/* @flow */

// This file resolves the assets available from our client bundle.

import fs from 'fs';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import config from '../../../../config';

const assetsFilePath = pathResolve(
  appRootDir.get(),
  config.bundles.client.outputPath,
  `./${config.bundleAssetsFileName}`,
);

if (!fs.existsSync(assetsFilePath)) {
  throw new Error(
    `We could not find the "${assetsFilePath}" file, which contains a list of the assets of the client bundle.  Please ensure that the client bundle has been built.`,
  );
}

const readAssetsJSONFile = () => JSON.parse(fs.readFileSync(assetsFilePath, 'utf8'));
const assetsJSON = readAssetsJSONFile();
const assetsJSONResolver = () => (
  process.env.NODE_ENV === 'development'
    // In development mode we always read the assets json file from disk to avoid
    // any cases where an older version gets cached.
    ? readAssetsJSONFile()
    // Otherwise we return the initially parsed JSON file.
    : assetsJSON
);

/**
 * Retrieves the js/css for the named chunks that belong to our client bundle.
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
    const chunkAssets = assetsJSONResolver()[chunkName];
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
