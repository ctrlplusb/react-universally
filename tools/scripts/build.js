/* @flow */

// This script builds a production output of all of our bundles.

import webpack from 'webpack';
import clientConfigFactory from '../webpack/client.config';
import serverConfigFactory from '../webpack/server.config';

const clientCompiler = webpack(clientConfigFactory());
const serverCompiler = webpack(serverConfigFactory());

clientCompiler.run(() => console.log('Client built.'));
serverCompiler.run(() => console.log('Server built.'));
