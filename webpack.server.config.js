const webpackConfigFactory = require('./webpackConfigFactory');

module.exports = function serverConfigFactory(options = {}, args = {}) {
  const { mode = 'development' } = options;
  return webpackConfigFactory({ target: 'server', mode }, args);
};
