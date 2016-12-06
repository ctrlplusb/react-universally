/* @flow */

// This script builds a production output of all of our bundles.

import webpack from 'webpack';
import webpackConfigFactory from '../webpack/configFactory';
import staticConfig from '../../config/static';

Object.keys(staticConfig.bundles).forEach((bundleName) => {
  const compiler = webpack(
    webpackConfigFactory({ target: bundleName, mode: 'production' }),
  );
  compiler.run(() => console.log(`"${bundleName}" bundle built.`));
});
