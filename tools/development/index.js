/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/newline-after-import */

const path = require('path');
const chokidar = require('chokidar');
const webpack = require('webpack');
const createNotification = require('./createNotification');
const HotServer = require('./hotServer');
const HotClient = require('./hotClient');

class HotDevelopment {
  constructor() {
    // Bind our functions to avoid any scope/closure issues.
    this.start = this.start.bind(this);
    this.restart = this.restart.bind(this);
    this._configureHotClient = this._configureHotClient.bind(this);
    this._configureHotServer = this._configureHotServer.bind(this);

    this.clientBundle = null;
    this.clientCompiler = null;
    this.serverBundle = null;
    this.serverCompiler = null;
  }

  start() {
    try {
      const clientConfig = require('../webpack/client.config')({ mode: 'development' });
      this.clientCompiler = webpack(clientConfig);

      const universalMiddlewareConfig = require('../webpack/universalMiddleware.config')({ mode: 'development' });
      this.universalMiddlewareCompiler = webpack(universalMiddlewareConfig);

      const serverConfig = require('../webpack/server.config')({ mode: 'development' });
      this.serverCompiler = webpack(serverConfig);
    } catch (err) {
      createNotification({
        title: 'webpack',
        message: '😵  Webpack config invalid, check console for error',
      });
      console.log(err);
      return;
    }

    this._configureHotClient();
    this._configureHotUniversalMiddleware();
    this._configureHotServer();
  }

  dispose() {
    // We want to forcefully close our servers (passing true) which will hard
    // kill any existing connections.  We don't care about them running as we
    // need to restart both the client and server bundles.
    const safeDisposeClient = () =>
      (this.clientBundle ? this.clientBundle.dispose(true) : Promise.resolve());

    const safeDisposeServer = () =>
      (this.serverBundle ? this.serverBundle.dispose(true) : Promise.resolve());

    return safeDisposeClient().then(safeDisposeServer);
  }

  restart() {
    const clearWebpackConfigsCache = () => {
      Object.keys(require.cache).forEach((modulePath) => {
        if (modulePath.indexOf('webpack') !== -1) {
          delete require.cache[modulePath];
        }
      });
    };

    this.dispose()
      .then(clearWebpackConfigsCache)
      .then(this.start, err => console.log(err))
      .catch(err => console.log(err));
  }

  _configureHotClient() {
    this.clientCompiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        createNotification({
          title: 'client',
          message: '😵  Build failed, check console for error',
        });
        console.log(stats.toString());
      } else {
        createNotification({
          title: 'client',
          message: '✅  Built',
        });
      }
    });

    this.clientBundle = new HotClient(this.clientCompiler);
  }

  _configureHotUniversalMiddleware() {
    const compileUniversalMiddleware = () => {
      this.universalMiddlewareCompiler.run(() => undefined);
    };

    this.clientCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors()) {
        compileUniversalMiddleware();
      }
    });

    this.universalMiddlewareCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors()) {
        // Make sure our newly built bundle is removed from the module cache.
        Object.keys(require.cache).forEach((modulePath) => {
          if (modulePath.indexOf('universalMiddleware') !== -1) {
            delete require.cache[modulePath];
          }
        });
      }
    });

    // Now we will configure `chokidar` to watch our server specific source folder.
    // Any changes will cause a rebuild of the server bundle.
    this.watcher = chokidar.watch([path.resolve(__dirname, '../../src/universalMiddleware')]);
    this.watcher.on('ready', () => {
      this.watcher
        .on('add', compileUniversalMiddleware)
        .on('addDir', compileUniversalMiddleware)
        .on('change', compileUniversalMiddleware)
        .on('unlink', compileUniversalMiddleware)
        .on('unlinkDir', compileUniversalMiddleware);
    });
  }

  _configureHotServer() {
    const compileHotServer = () => {
      const runCompiler = () => this.serverCompiler.run(() => undefined);
      // Shut down any existing running server if necessary before starting the
      // compile, else just compile.
      if (this.serverBundle) {
        this.serverBundle.dispose(true).then(runCompiler);
      } else {
        runCompiler();
      }
    };

    let clientBuilt = false;
    let middlewareBuilt = false;
    let started = false;

    this.clientCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors()) {
        clientBuilt = true;
        if (!started && (clientBuilt && middlewareBuilt)) {
          started = true;
          compileHotServer();
        }
      }
    });

    this.universalMiddlewareCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors()) {
        middlewareBuilt = true;
        if (!started && (clientBuilt && middlewareBuilt)) {
          started = true;
          compileHotServer();
        }
      }
    });

    this.serverCompiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        createNotification({
          title: 'server',
          message: '😵  Build failed, check console for error',
        });
        console.log(stats.toString());
        return;
      }

      createNotification({
        title: 'server',
        message: '✅  Built',
      });

      // Make sure our newly built server bundles aren't in the module cache.
      Object.keys(require.cache).forEach((modulePath) => {
        if (modulePath.indexOf(this.serverCompiler.options.output.path) !== -1) {
          delete require.cache[modulePath];
        }
      });

      this.serverBundle = new HotServer(this.serverCompiler);
    });

    // Now we will configure `chokidar` to watch our server specific source folder.
    // Any changes will cause a rebuild of the server bundle.
    this.watcher = chokidar.watch([path.resolve(__dirname, '../../src/server')]);
    this.watcher.on('ready', () => {
      this.watcher
        .on('add', compileHotServer)
        .on('addDir', compileHotServer)
        .on('change', compileHotServer)
        .on('unlink', compileHotServer)
        .on('unlinkDir', compileHotServer);
    });
  }
}

const hotDevelopment = new HotDevelopment();

// Any changes to our webpack config builder will cause us to restart our
// hot servers.
const watcher = chokidar.watch(
  path.resolve(__dirname, '../webpack/configFactory.js')
);
watcher.on('ready', () => {
  watcher.on('change', () => {
    createNotification({
      title: 'webpack',
      message: '❗️  Webpack config changed. Full restart occurring..',
    });
    hotDevelopment.restart();
  });
});

hotDevelopment.start();

// If we receive a kill cmd then we will first try to dispose our listeners.
process.on('SIGTERM', () => hotDevelopment.dispose().then(() => process.exit(0)));
