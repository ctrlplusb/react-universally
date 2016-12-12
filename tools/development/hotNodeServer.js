/* @flow */

import path from 'path';
import appRootDir from 'app-root-dir';
import { spawn } from 'child_process';
import { log } from '../utils';

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
      log({
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
          log({
            title: name,
            level: 'error',
            message: 'Build failed, check the console for more information.',
            notify: true,
          });
          console.log(stats.toString());
          return;
        }

        const newServer = spawn('node', [compiledEntryFile]);

        log({
          title: 'server',
          level: 'info',
          message: 'Server running with latest changes. Check the console for more info.',
          notify: true,
        });

        newServer.stdout.on('data', (data) => {
          const message = data.toString().trim();
          log({
            title: 'server',
            level: 'info',
            message,
          });
        });
        newServer.stderr.on('data', (data) => {
          const message = data.toString().trim();
          log({
            title: 'server',
            level: 'error',
            message,
          });
        });
        this.server = newServer;
      } catch (err) {
        log({
          title: name,
          level: 'error',
          message: 'Failed to start, please check the console for more information.',
          notify: true,
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
