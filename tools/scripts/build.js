/* @flow */

// This script builds a production output of all of our bundles.

import webpack from 'webpack';
import webpackConfigFactory from '../webpack/configFactory';
import projConfig from '../../config/project';

Object.keys(projConfig.bundles).forEach((bundleName) => {
  const compiler = webpack(
    webpackConfigFactory({ target: bundleName, mode: 'production' }),
  );
  compiler.run(() => console.log(`"${bundleName}" bundle built.`));
});
