const webpackConfigFactory = require('./webpackConfigFactory');

module.exports = function serverConfigFactory(options = {}) {
  const { mode = 'development' } = options;
  return webpackConfigFactory({ target: 'server', mode });
};
