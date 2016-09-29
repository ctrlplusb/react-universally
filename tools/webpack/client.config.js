const webpackConfigFactory = require('./configFactory');

module.exports = function clientConfigFactory(options = {}, args = {}) {
  const { mode = 'production' } = options;
  return webpackConfigFactory({ target: 'client', mode }, args);
};
