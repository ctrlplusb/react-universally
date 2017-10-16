import os from 'os';
import HappyPack from 'happypack';
import notifier from 'node-notifier';
import { execSync } from 'child_process';
import appRootDir from 'app-root-dir';
import * as LoggingUtils from '../shared/utils/logging';

// Generates a HappyPack plugin.
// @see https://github.com/amireh/happypack/
export function happyPackPlugin({ name, loaders }) {
  // eslint-disable-next-line
  const compilerThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length,
  });
  return new HappyPack({
    id: name,
    verbose: false,
    threadPool: compilerThreadPool,
    loaders,
  });
}

export function log(options) {
  const title = `${options.title.toUpperCase()}`;

  if (options.notify) {
    notifier.notify({
      title,
      message: options.message,
    });
  }

  LoggingUtils.log(
    Object.assign({}, options, {
      message: `${title}: ${options.message}`,
    }),
  );
}

export function exec(command) {
  execSync(command, { stdio: 'inherit', cwd: appRootDir.get() });
}
