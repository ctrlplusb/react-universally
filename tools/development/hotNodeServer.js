/* @flow */

import path from 'path';
import appRootDir from 'app-root-dir';
import { spawn } from 'child_process';
import { createNotification } from '../utils';

class HotNodeServer {
  watcher: any;
  disposing: bool;
  server: ?Object;

  constructor(name: string, compiler : Object) {
    let firstMessageOutput = false;

    const compiledEntryFile = path.resolve(
      appRootDir.get(),
      compiler.options.output.path,
      `${Object.keys(compiler.options.entry)[0]}.js`,
    );

    compiler.plugin('compile', () => {
      firstMessageOutput = false;
      createNotification({
        title: name,
        level: 'info',
        message: 'Building new bundle...',
      });
    });


    compiler.plugin('done', (stats) => {
      if (this.disposing) {
        return;
      }

      try {
        if (this.server) {
          this.server.kill();
          this.server = null;
        }

        if (stats.hasErrors()) {
          createNotification({
            title: name,
            level: 'error',
            message: 'Build failed, check the console for more information.',
          });
          console.log(stats.toString());
          return;
        }

        const newServer = spawn('node', [compiledEntryFile]);
        newServer.stdout.on('data', (data) => {
          const message = data.toString().trim();
          if (!firstMessageOutput) {
            firstMessageOutput = true;
            createNotification({
              title: 'server',
              level: 'info',
              message,
            });
          }
          console.log(message);
        });
        newServer.stderr.on('data', data => console.error(data.toString().trim()));
        this.server = newServer;
      } catch (err) {
        createNotification({
          title: name,
          level: 'error',
          message: 'Failed to start, please check the console for more information.',
        });
        console.log(err);
      }
    });

    // Lets start the compiler.
    this.watcher = compiler.watch(null, () => undefined);
  }

  dispose() {
    this.disposing = true;

    const stopWatcher = new Promise((resolve) => {
      this.watcher.close(resolve);
    });

    return stopWatcher.then(() => this.server && this.server.kill());
  }
}

export default HotNodeServer;
