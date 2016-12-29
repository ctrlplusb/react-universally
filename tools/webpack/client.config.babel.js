import webpackConfigFactory from './configFactory';


export default function clientConfigFactory(options = {}) {
  const { mode = 'production' } = options;
  return webpackConfigFactory({ target: 'client', mode });
}
