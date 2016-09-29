const webpackConfigFactory = require('./configFactory');

module.exports = function clientConfigFactory(options = {}, args = {}) {
  const { mode = 'production' } = options;
  const config = webpackConfigFactory({ target: 'client', mode }, args);

  console.log(config.entry);

  return config;
};
