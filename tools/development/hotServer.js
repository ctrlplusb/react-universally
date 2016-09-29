/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const envVars = require('../config/envVars');
const ListenerManager = require('./listenerManager');
const createNotification = require('./createNotification');

class HotServer {
  constructor(compiler) {
    this.compiler = compiler;
    this.listenerManager = null;

    const compiledOutputPath = path.resolve(
      compiler.options.output.path, `${Object.keys(compiler.options.entry)[0]}.js`
    );

    try {
      // The server bundle  will automatically start the web server just by
      // requiring it. It returns the http listener too.
      const listener = require(compiledOutputPath).default;
      this.listenerManager = new ListenerManager(listener);

      const url = `http://localhost:${envVars.SERVER_PORT}`;

      createNotification({
        title: 'server',
        message: `🌎  Running on ${url}`,
        open: url,
      });
    } catch (err) {
      createNotification({
        title: 'server',
        message: '😵  Bundle invalid, check console for error',
      });
      console.log(err);
    }
  }

  dispose(force = false) {
    return this.listenerManager
      ? this.listenerManager.dispose(force)
      : Promise.resolve();
  }
}

module.exports = HotServer;
