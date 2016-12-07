/* @flow */

// This script creates a webpack stats file on our production build of the
// client bundle and then launches the webpack-bundle-analyzer tool allowing
// you to easily see what is being included within your bundle.  Really helpful
// in those parses at trimming your bundle sizes down.
// @see https://github.com/th0r/webpack-bundle-analyzer

import webpack from 'webpack';
import fs from 'fs';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import clientConfigFactory from '../webpack/client.config';
import { exec } from '../utils';
import projConfig from '../../config/private/project';

const anaylzeFilePath = pathResolve(
  appRootDir.get(), projConfig.bundles.client.outputPath, '__analyze__.json',
);

const clientCompiler = webpack(clientConfigFactory());

clientCompiler.run((err, stats) => {
  if (err) {
    console.error(err);
  } else {
    // Write out the json stats file.
    fs.writeFileSync(
      anaylzeFilePath,
      JSON.stringify(stats.toJson('verbose'), null, 4),
    );

    // Run the bundle analyzer against the stats file.
    const cmd = `webpack-bundle-analyzer ${anaylzeFilePath} ${projConfig.bundles.client.outputPath}`;
    exec(cmd);
  }
});
