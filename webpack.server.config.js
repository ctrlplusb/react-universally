const webpackConfigFactory = require('./webpackConfigFactory')

module.exports = function (options = {}) {
  const { mode = 'development' } = options
  return webpackConfigFactory({ target: 'server', mode: mode })
}
