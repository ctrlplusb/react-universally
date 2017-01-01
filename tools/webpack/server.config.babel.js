import webpackConfigFactory from './configFactory';

export default function serverConfigFactory(options = {}) {
  const { mode = 'development' } = options;
  return webpackConfigFactory({ target: 'server', mode });
}
