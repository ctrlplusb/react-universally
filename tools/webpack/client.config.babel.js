import webpackConfigFactory from './configFactory';

export default function clientConfigFactory(options = {}) {
  const { mode = 'development' } = options;
  return webpackConfigFactory({ target: 'client', mode });
}
