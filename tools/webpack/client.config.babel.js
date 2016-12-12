/* @flow */

import webpackConfigFactory from './configFactory';

type Options = { mode?: 'production'|'development' };

export default function clientConfigFactory(options : Options = {}) {
  const { mode = 'production' } = options;
  return webpackConfigFactory({ target: 'client', mode });
}
