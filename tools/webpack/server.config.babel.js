import webpackConfigFactory from './configFactory';


export default function serverConfigFactory(options = {}) {
  const { mode = 'production' } = options;
  return webpackConfigFactory({ target: 'server', mode });
}
