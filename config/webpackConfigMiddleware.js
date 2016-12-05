/* eslint-disable no-unused-vars */

import type { BuildOptions } from '../tools/types';

// This middleware allowing you to do final adjustments to the webpack
// configuration before it gets used.
//
// Whilst you could go and make adjustments to your webpack configuration
// directly, one benefit of using this approach is that you can easily
// pull updates from the main repository and not have to deal with merge
// conflicts.
//
// I would recommend the use of webpack-merge to help you with making
// modifications to each config.
export default function webpackConfigMiddleware(
  config : Object, buildOptions : BuildOptions) {
  const { target, mode } = buildOptions;
  return config;
}
