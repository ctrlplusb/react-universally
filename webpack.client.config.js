const webpackConfigFactory = require('./webpackConfigFactory');

module.exports = function clientConfigFactory(options = {}, args = {}) {
  const { mode = 'development' } = options;
  return webpackConfigFactory({ target: 'client', mode }, args);
};
