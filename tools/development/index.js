const pathResolve = require('path').resolve;
const chokidar = require('chokidar');
const webpack = require('webpack');
const { createNotification } = require('../utils');
const HotServer = require('./hotServer');
const HotClient = require('./hotClient');
const ensureVendorDLLExists = require('./ensureVendorDLLExists');
const vendorDLLPaths = require('../config/vendorDLLPaths');

class HotDevelopment {
  constructor() {
    ensureVendorDLLExists().then(() => {
      try {
        const clientConfigFactory = require('../webpack/client.config');
        const clientConfig = clientConfigFactory({ mode: 'development' });
        // Install the vendor DLL plugin.
        clientConfig.plugins.push(
          new webpack.DllReferencePlugin({
            manifest: require(vendorDLLPaths.dllJsonPath),
          })
        );
        this.clientCompiler = webpack(clientConfig);

        const middlewareConfigFactory = require('../webpack/universalMiddleware.config');
        const middlewareConfig = middlewareConfigFactory({ mode: 'development' });
        this.middlewareCompiler = webpack(middlewareConfig);

        const serverConfigFactory = require('../webpack/server.config');
        const serverConfig = serverConfigFactory({ mode: 'development' });
        this.serverCompiler = webpack(serverConfig);
      } catch (err) {
        createNotification({
          title: 'development',
          level: 'error',
          message: 'Webpack configs are invalid, please check the console for more information.',
        });
        console.log(err);
        return;
      }

      this.prepHotServer();
      this.prepHotUniversalMiddleware();
      this.prepHotClient();
    }).catch((err) => {
      createNotification({
        title: 'vendorDLL',
        level: 'error',
        message: 'Unfortunately an error occured whilst trying to build the vendor dll used by the development server. Please check the console for more information.',
      });
      if (err) {
        console.log(err);
      }
    });
  }

  prepHotClient() {
    this.clientBundle = new HotClient(this.clientCompiler);
  }

  prepHotUniversalMiddleware() {
    let started = false;

    const runMiddlewareCompiler = () => {
      this.middlewareCompiler.watch({}, () => undefined);
    };

    this.clientCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors() && !started) {
        started = true;
        runMiddlewareCompiler();
      }
    });

    this.middlewareCompiler.plugin('compile', () => {
      createNotification({
        title: 'universalMiddleware',
        level: 'info',
        message: 'Building new bundle...',
      });
    });

    this.middlewareCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors()) {
        // Make sure our newly built bundle is removed from the module cache.
        Object.keys(require.cache).forEach((modulePath) => {
          if (modulePath.indexOf('universalMiddleware') !== -1) {
            delete require.cache[modulePath];
          }
        });

        createNotification({
          title: 'universalMiddleware',
          level: 'info',
          message: 'Available with latest changes.',
        });
      } else {
        createNotification({
          title: 'universalMiddleware',
          level: 'error',
          message: 'Build failed, please check the console for more information.',
        });
        console.log(stats.toString());
      }
    });
  }

  prepHotServer() {
    let clientBuilt = false;
    let middlewareBuilt = false;
    let started = false;

    const startServerBundleWhenReady = () => {
      if (!started && (clientBuilt && middlewareBuilt)) {
        started = true;
        this.serverBundle = new HotServer(this.serverCompiler);
      }
    };

    this.clientCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors() && !clientBuilt) {
        clientBuilt = true;
        startServerBundleWhenReady();
      }
    });

    this.middlewareCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors() && !middlewareBuilt) {
        middlewareBuilt = true;
        startServerBundleWhenReady();
      }
    });
  }

  dispose() {
    const safeDisposer = bundle => () => (bundle ? bundle.dispose() : Promise.resolve());
    const safeDisposeClient = safeDisposer(this.clientBundle);
    const safeDisposeServer = safeDisposer(this.serverBundle);

    return safeDisposeClient()
      .then(() => console.log('disposed client'))
      .then(safeDisposeServer);
  }
}

const hotDevelopment = new HotDevelopment();

// Any changes to our webpack configs should be notified as requiring a restart
// of the development tool.
const watcher = chokidar.watch(
  pathResolve(__dirname, '../webpack')
);
watcher.on('ready', () => {
  watcher.on('change', () => {
    createNotification({
      title: 'webpack',
      level: 'warn',
      message: 'Webpack config changed. Please restart your development server to use the latest version of the configs.',
    });
  });
});

// If we receive a kill cmd then we will first try to dispose our listeners.
process.on('SIGTERM', () => hotDevelopment.dispose().then(() => process.exit(0)));
