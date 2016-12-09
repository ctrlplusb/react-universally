/* @flow */

import path from 'path';
import appRootDir from 'app-root-dir';
import ListenerManager from './listenerManager';
import { createNotification } from '../utils';

class HotNodeServer {
  listenerManager: ?ListenerManager;
  watcher: any;

  constructor(name: string, compiler : Object) {
    this.listenerManager = null;
    this.watcher = null;

    const compiledEntryFile = path.resolve(
      appRootDir.get(),
      compiler.options.output.path,
      `${Object.keys(compiler.options.entry)[0]}.js`,
    );

    compiler.plugin('compile', () =>
      createNotification({
        title: name,
        level: 'info',
        message: 'Building new bundle...',
      }),
    );

    const startServer = () => {
      try {
        // The server bundle  will automatically start the web server just by
        // requiring it. It returns the http listener too.
        // $FlowFixMe
        const listener = require(compiledEntryFile).default;
        this.listenerManager = new ListenerManager(listener, name);

        listener.on('listening', () => {
          const { address, port } = listener.address();
          const url = `http://${address}:${port}`;
          createNotification({
            title: 'server',
            level: 'info',
            message: `Running on ${url} with latest changes.`,
            open: url,
          });
        });
      } catch (err) {
        createNotification({
          title: 'server',
          level: 'error',
          message: 'Failed to start, please check the console for more information.',
        });
        console.log(err);
      }
    };

    compiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        createNotification({
          title: 'server',
          level: 'error',
          message: 'Build failed, check the console for more information.',
        });
        console.log(stats.toString());
        return;
      }

      // Make sure our newly built server bundles aren't in the module cache.
      Object.keys(require.cache).forEach((modulePath) => {
        if (modulePath.indexOf(compiler.options.output.path) !== -1) {
          delete require.cache[modulePath];
        }
      });

      // Shut down any existing running listener if necessary.
      if (this.listenerManager) {
        this.listenerManager.dispose(true).then(startServer);
      } else {
        startServer();
      }
    });

    // Lets start the compiler.
    this.watcher = compiler.watch(null, () => undefined);
  }

  dispose() {
    const stopWatcher = () => new Promise(resolve => this.watcher.close(resolve));

    return Promise.all([
      this.watcher ? stopWatcher() : Promise.resolve(),
      this.listenerManager ? this.listenerManager.dispose() : Promise.resolve(),
    ]);
  }
}

export default HotNodeServer;
