/* @flow */

import { resolve as pathResolve } from 'path';
import chokidar from 'chokidar';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';
import { createNotification } from '../utils';
import HotNodeServer from './hotNodeServer';
import HotClientServer from './hotClientServer';
import createVendorDLL from './createVendorDLL';
import webpackConfigFactory from '../webpack/configFactory';
import projConfig from '../../config/private/project';

const usesDevVendorDLL = bundleConfig =>
  bundleConfig.devVendorDLL != null && bundleConfig.devVendorDLL.enabled;

const vendorDLLsFailed = (err) => {
  createNotification({
    title: 'vendorDLL',
    level: 'error',
    message: 'Unfortunately an error occured whilst trying to build the vendor dll(s) used by the development server. Please check the console for more information.',
  });
  if (err) {
    console.log(err);
  }
};

const initializeBundle = (name, bundleConfig) => {
  try {
    const createCompiler = () => {
      const webpackConfig = webpackConfigFactory({
        target: name,
        mode: 'development',
      });
      // Install the vendor DLL config for the client bundle if required.
      if (name === 'client' && usesDevVendorDLL(bundleConfig)) {
        // Install the vendor DLL plugin.
        webpackConfig.plugins.push(
          new webpack.DllReferencePlugin({
            // $FlowFixMe
            manifest: require(
              pathResolve(
                appRootDir.get(),
                bundleConfig.outputPath,
                `${bundleConfig.devVendorDLL.name}.json`,
              ),
            ),
          }),
        );
      }
      return webpack(webpackConfig);
    };
    return { name, bundleConfig, createCompiler };
  } catch (err) {
    createNotification({
      title: 'development',
      level: 'error',
      message: 'Webpack bundleConfigs are invalid, please check the console for more information.',
    });
    console.log(err);
    throw err;
  }
};

class HotDevelopment {
  hotNodeServers: Array<HotNodeServer>;
  hotClientServer: ?HotClientServer;

  constructor() {
    this.hotClientServer = null;
    this.hotNodeServers = [];

    const clientBundle = initializeBundle('client', projConfig.bundles.client);

    const nodeBundles = [initializeBundle('server', projConfig.bundles.server)]
      .concat(Object.keys(projConfig.additionalNodeBundles).map(name =>
        initializeBundle(name, projConfig.additionalNodeBundles[name]),
      ));

    Promise
      // First ensure the client dev vendor DLLs is created if needed.
      .resolve(
        usesDevVendorDLL(projConfig.bundles.client)
          ? createVendorDLL('client', projConfig.bundles.client)
          : true,
      )
      // Then start the client development server.
      .then(() => new Promise((resolve) => {
        const { createCompiler } = clientBundle;
        const compiler = createCompiler();
        compiler.plugin('done', (stats) => {
          if (!stats.hasErrors()) {
            resolve();
          }
        });
        this.hotClientServer = new HotClientServer(compiler);
      }), vendorDLLsFailed)
      // Then start the node development server(s).
      .then(() => {
        this.hotNodeServers = nodeBundles
          .map(({ name, createCompiler }) =>
            new HotNodeServer(name, createCompiler()),
          );
      });
  }

  dispose() {
    const safeDisposer = server =>
      (server ? server.dispose() : Promise.resolve([]));

    // First the hot client server.
    return safeDisposer(this.hotClientServer)
      // Then dispose the hot node server(s).
      .then(() => Promise.all(this.hotNodeServers.map(safeDisposer)));
  }
}

let hotDevelopment = new HotDevelopment();

// Any changes to our webpack bundleConfigs should restart the development server.
const watcher = chokidar.watch(
  pathResolve(__dirname, '../webpack'),
);
watcher.on('ready', () => {
  watcher.on('change', () => {
    createNotification({
      title: 'webpack',
      level: 'warn',
      message: 'Webpack bundleConfigs have changed. The development server is restarting...',
    });
    hotDevelopment.dispose().then(() => {
      // Make sure our new webpack bundleConfigs aren't in the module cache.
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
