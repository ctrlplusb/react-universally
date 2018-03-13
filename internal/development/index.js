import http from 'http';
import openBrowser from 'react-dev-utils/openBrowser';
import chokidar from 'chokidar';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import config from '../../config/values';
import { log } from '../utils';

let HotDevelopment = require('./hotDevelopment').default;
let devServer = new HotDevelopment();

// Any changes to our webpack bundleConfigs should restart the development devServer.
const watcher = chokidar.watch([
  pathResolve(appRootDir.get(), 'internal'),
  pathResolve(appRootDir.get(), 'config'),
]);

// Wait until specific endpoint becomes responsive, then fire callback.
const onResponsive = (hostname, port, cb) =>
  setTimeout(
    () =>
      http
        .get({ hostname, port, path: '/', agent: false }, cb)
        .on('error', () => onResponsive(hostname, port, cb)),
    1000,
  );

// Get host and port
const host = config('host');
const port = config('port');

watcher.on('ready', () => {
  watcher.on('change', () => {
    log({
      title: 'webpack',
      level: 'warn',
      message:
        'Project build configuration has changed. Restarting the development devServer...',
    });
    devServer.dispose().then(() => {
      // Make sure our new webpack bundleConfigs aren't in the module cache.
      Object.keys(require.cache).forEach(modulePath => {
        if (modulePath.indexOf('config') !== -1) {
          delete require.cache[modulePath];
        } else if (modulePath.indexOf('internal') !== -1) {
          delete require.cache[modulePath];
        }
      });

      // Re-require the development devServer so that all new configs are used.
      HotDevelopment = require('./hotDevelopment').default;

      // Create a new development devServer.
      devServer = new HotDevelopment();
    });
  });

  // Wait until devServer is started.
  onResponsive(host, port, () => openBrowser(`http://${host}:${port}`));
});

// If we receive a kill cmd then we will first try to dispose our listeners.
process.on(
  'SIGTERM',
  () => devServer && devServer.dispose().then(() => process.exit(0)),
);
