const webpackConfigFactory = require('./configFactory');

module.exports = function serverConfigFactory(options = {}, args = {}) {
  const { mode = 'production' } = options;
  return webpackConfigFactory({ target: 'universalMiddleware', mode }, args);
};
