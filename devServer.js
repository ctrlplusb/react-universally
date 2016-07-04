/* eslint-disable no-console,global-require,no-underscore-dangle */

const path = require('path');
const notifier = require('node-notifier');
const chokidar = require('chokidar');
const webpack = require('webpack');
const express = require('express');
const createWebpackMiddleware = require('webpack-dev-middleware');
const createWebpackHotMiddleware = require('webpack-hot-middleware');

function createNotification(subject, msg, open) {
  const title = `🔥  ${subject.toUpperCase()}`;

  var notifyProps = {
    title,
    message: msg
  };

  if (typeof open === "string") {
    notifyProps.open = open;
  }

  notifier.notify(notifyProps);

  console.log(`==> ${title} -> ${msg}`);
}

class ListenerManager {
  constructor(listener) {
    this.lastConnectionKey = 0;
    this.connectionMap = {};
    this.listener = listener;

    // Track all connections to our server so that we can close them when needed.
    this.listener.on('connection', connection => {
      // Generate a new key to represent the connection
      const connectionKey = ++this.lastConnectionKey;
      // Add the connection to our map.
      this.connectionMap[connectionKey] = connection;
      // Remove the connection from our map when it closes.
      connection.on('close', () => {
        delete this.connectionMap[connectionKey];
      });
    });
  }

  dispose() {
    return new Promise(resolve => {
      // First we destroy any connections.
      Object.keys(this.connectionMap).forEach((connectionKey) => {
        this.connectionMap[connectionKey].destroy();
      });

      // Then we close the listener.
      if (this.listener) {
        this.listener.close(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

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
      this.listenerManager = new ListenerManager(require(compiledOutputPath).default);

      createNotification('server', '🌎  Running', `http://localhost:${process.env.SERVER_PORT}`);
    } catch (err) {
      createNotification('server', '😵  Bundle invalid, check console for error');
      console.log(err);
    }
  }

  dispose() {
    return Promise.all([
      this.listenerManager ? this.listenerManager.dispose() : undefined,
    ]);
  }
}

class HotClient {
  constructor(compiler) {
    const app = express();
    this.webpackDevMiddleware = createWebpackMiddleware(compiler, {
      quiet: true,
      noInfo: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      // The path at which the client bundles are served from.  Note: in this
      // case as we are running a seperate dev server the public path should
      // be absolute, i.e. including the "http://..."
      publicPath: compiler.options.output.publicPath,
    });
    app.use(this.webpackDevMiddleware);
    app.use(createWebpackHotMiddleware(compiler));

    const listener = app.listen(process.env.CLIENT_DEVSERVER_PORT);
    this.listenerManager = new ListenerManager(listener);

    createNotification('client', '✅  Running');
  }

  dispose() {
    this.webpackDevMiddleware.close();

    return Promise.all([
      this.listenerManager ? this.listenerManager.dispose() : undefined,
    ]);
  }
}

class HotServers {
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
      const clientConfig = require('./webpack.client.config')({ mode: 'development' });
      this.clientCompiler = webpack(clientConfig);
      const serverConfig = require('./webpack.server.config')({ mode: 'development' });
      this.serverCompiler = webpack(serverConfig);
    } catch (err) {
      createNotification('webpack', '😵  Webpack config invalid, check console for error');
      console.log(err);
      return;
    }

    this._configureHotClient();
    this._configureHotServer();
  }

  restart() {
    const clearWebpackConfigsCache = () => {
      Object.keys(require.cache).forEach(modulePath => {
        if (~modulePath.indexOf('webpack')) {
          delete require.cache[modulePath];
        }
      });
    };

    Promise.all([
      this.serverBundle ? this.serverBundle.dispose() : undefined,
      this.clientBundle ? this.clientBundle.dispose() : undefined,
    ]).then(clearWebpackConfigsCache).then(this.start, err => console.log(err));
  }

  _configureHotClient() {
    this.clientCompiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        createNotification('client', '😵  Build failed, check console for error');
        console.log(stats.toString());
      } else {
        createNotification('client', '✅  Built');
      }
    });

    this.clientBundle = new HotClient(this.clientCompiler);
  }

  _configureHotServer() {
    const compileHotServer = () => {
      const runCompiler = () => this.serverCompiler.run(() => undefined);
      // Shut down any existing running server if necessary before starting the
      // compile, else just compile.
      if (this.serverBundle) {
        this.serverBundle.dispose().then(runCompiler);
      } else {
        runCompiler();
      }
    };

    this.clientCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors()) {
        compileHotServer();
      }
    });

    this.serverCompiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        createNotification('server', '😵  Build failed, check console for error');
        console.log(stats.toString());
        return;
      }

      createNotification('server', '✅  Built');

      // Make sure our newly built server bundles aren't in the module cache.
      Object.keys(require.cache).forEach(modulePath => {
        if (~modulePath.indexOf(this.serverCompiler.options.output.path)) {
          delete require.cache[modulePath];
        }
      });

      this.serverBundle = new HotServer(this.serverCompiler);
    });

    // Now we will configure `chokidar` to watch our server specific source folder.
    // Any changes will cause a rebuild of the server bundle.
    this.watcher = chokidar.watch([path.resolve(__dirname, './src/server')]);
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

const hotServers = new HotServers();

// Any changes to our webpack config builder will cause us to restart our
// hot servers.
const watcher = chokidar.watch(
  path.resolve(__dirname, './webpackConfigFactory.js')
);
watcher.on('ready', () => {
  watcher.on('change', hotServers.restart);
});

hotServers.start();
