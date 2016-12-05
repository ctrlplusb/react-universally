/* @flow */

// Runs flow type checking.

import { existsSync } from 'fs';
import { resolve as resolvePath } from 'path';
import appRootDir from 'app-root-dir';
import { exec, createNotification } from '../utils';

if (!existsSync(resolvePath(appRootDir.get(), './flow-typed'))) {
  createNotification({
    title: 'flow',
    level: 'warn',
    message: 'You haven\'t installed the flow-typed definitions. Please run the `npm run flow:defs` command if you would like to install them.',
  });
}

try {
  exec('flow');
} catch (err) {
  // Flow will print any errors.
}
