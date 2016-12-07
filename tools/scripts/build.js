/* @flow */

// This script builds a production output of all of our bundles.

import webpack from 'webpack';
import appRootDir from 'app-root-dir';
import { resolve as pathResolve } from 'path';
import webpackConfigFactory from '../webpack/configFactory';
import projConfig from '../../config/private/project';
import { exec } from '../utils';

// First clear the build output dir.
exec(`rimraf ${pathResolve(appRootDir.get(), projConfig.buildOutputPath)}`);

// Get our "fixed" bundle names
Object.keys(projConfig.bundles)
// And the "additional" bundle names
.concat(Object.keys(projConfig.additionalNodeBundles))
// And then build them all.
.forEach((bundleName) => {
  const compiler = webpack(
    webpackConfigFactory({ target: bundleName, mode: 'production' }),
  );
  compiler.run(() => console.log(`"${bundleName}" bundle built.`));
});
