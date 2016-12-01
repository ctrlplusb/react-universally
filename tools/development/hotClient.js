/* @flow */

import express from 'express';
import createWebpackMiddleware from 'webpack-dev-middleware';
import createWebpackHotMiddleware from 'webpack-hot-middleware';
import ListenerManager from './listenerManager';
import { createNotification } from '../utils';
import config from '../config';

class HotClient {
  webpackDevMiddleware: any;
  listenerManager: ListenerManager;

  constructor(compiler : Object) {
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

    const listener = app.listen(config.development.clientDevServerPort);

    this.listenerManager = new ListenerManager(listener, 'client');

    compiler.plugin('compile', () => {
      createNotification({
        title: 'client',
        level: 'info',
        message: 'Building new bundle...',
      });
    });

    compiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        createNotification({
          title: 'client',
          level: 'error',
          message: 'Build failed, please check the console for more information.',
        });
        console.log(stats.toString());
      } else {
        createNotification({
          title: 'client',
          level: 'info',
          message: 'Running with latest changes.',
        });
      }
    });
  }

  dispose() {
    this.webpackDevMiddleware.close();

    return this.listenerManager
      ? this.listenerManager.dispose()
      : Promise.resolve([]);
  }
}

export default HotClient;
