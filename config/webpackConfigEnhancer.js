/* eslint-disable no-unused-vars */

import type { BuildOptions } from '../tools/types';

// This enhancer function allows you to provide final adjustments your webpack
// configurations for each bundle before they get used.
//
// Whilst you could go and make adjustments to the webpack configFactory
// directly, one benefit of using this approach is that you can easily
// pull updates from the main repository and not have to deal with merge
// conflicts.
//
// I would recommend looking at the "webpack-merge" module to help you with
// merging modifications to each config.
//
// This function will be called once for each for your bundles.  It will be
// provided the current webpack config, as well as the buildOptions which
// detail which bundle and mode is being targetted for the current function run.
export default function webpackConfigEnhancer(
  config : Object, buildOptions : BuildOptions) {
  const { target, mode } = buildOptions;

  // Example:
  /*
  if (target === 'server' && mode === 'development') {
    config.plugins.push(new MyCoolWebpackPlugin());
  }
  */

  // Debugging/Logging Example:
  /*
  if (target === 'server') {
    console.log(JSON.stringify(config, null, 4));
  }
  */

  return config;
}
