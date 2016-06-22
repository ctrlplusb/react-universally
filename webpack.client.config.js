const webpackConfigFactory = require('./webpackConfigFactory');

module.exports = function clientConfigFactory(options = {}) {
  const { mode = 'development' } = options;
  return webpackConfigFactory({ target: 'client', mode });
};
