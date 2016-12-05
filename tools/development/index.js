/* @flow */

import { resolve as pathResolve } from 'path';
import chokidar from 'chokidar';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';
import { createNotification } from '../utils';
import HotServer from './hotServer';
import HotClient from './hotClient';
import ensureVendorDLLExists from './ensureVendorDLLExists';
import staticConfig from '../../config/static';

class HotDevelopment {
  clientCompiler: any;
  serverCompiler: any;
  serverBundle: HotServer;
  clientBundle: HotClient;

  constructor() {
    ensureVendorDLLExists().then(() => {
      try {
        const clientConfigFactory = require('../webpack/client.config').default;
        const clientConfig = clientConfigFactory({ mode: 'development' });
        if (staticConfig.development.vendorDLL.enabled) {
          // Install the vendor DLL plugin.
          clientConfig.plugins.push(
            new webpack.DllReferencePlugin({
              // $FlowFixMe
              manifest: require(
                pathResolve(
                  appRootDir.get(),
                  staticConfig.clientBundle.outputPath,
                  `${staticConfig.development.vendorDLL.name}.json`,
                ),
              ),
            }),
          );
        }
        this.clientCompiler = webpack(clientConfig);

        const serverConfigFactory = require('../webpack/server.config').default;
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

      this.start();
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

  start() {
    let serverStarted = false;

    this.clientCompiler.plugin('done', (stats) => {
      if (!stats.hasErrors() && !serverStarted) {
        serverStarted = true;
        this.serverBundle = new HotServer(this.serverCompiler);
      }
    });

    this.clientBundle = new HotClient(this.clientCompiler);
  }

  dispose() {
    const safeDisposer = bundle => () => (bundle ? bundle.dispose() : Promise.resolve([]));
    const safeDisposeClient = safeDisposer(this.clientBundle);
    const safeDisposeServer = safeDisposer(this.serverBundle);

    return safeDisposeClient()
      .then(() => console.log('disposed client'))
      .then(safeDisposeServer);
  }
}

let hotDevelopment = new HotDevelopment();

// Any changes to our webpack configs should restart the development server.
const watcher = chokidar.watch(
  pathResolve(__dirname, '../webpack'),
);
watcher.on('ready', () => {
  watcher.on('change', () => {
    createNotification({
      title: 'webpack',
      level: 'warn',
      message: 'Webpack configs have changed. The development server is restarting...',
    });
    hotDevelopment.dispose().then(() => {
      // Make sure our new webpack configs aren't in the module cache.
      Object.keys(require.cache).forEach((modulePath) => {
        if (modulePath.indexOf('webpack') !== -1) {
          delete require.cache[modulePath];
        }
      });

      // Create a new development server.
      hotDevelopment = new HotDevelopment();
    });
  });
});

// If we receive a kill cmd then we will first try to dispose our listeners.
process.on('SIGTERM', () => hotDevelopment.dispose().then(() => process.exit(0)));
