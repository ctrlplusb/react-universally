import os from 'os';
import HappyPack from 'happypack';
import notifier from 'node-notifier';
import chalk from 'chalk';
import { execSync } from 'child_process';
import appRootDir from 'app-root-dir';

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

  const level = options.level || 'info';
  const msg = `${title}: ${options.message}`;

  switch (level) {
    case 'warn':
      console.log(chalk.yellowBright(msg));
      break;
    case 'error':
      console.log(chalk.bgRed.white.bold(msg));
      break;
    case 'special':
      console.log(chalk.italic.cyanBright(msg));
      break;
    case 'info':
    default:
      console.log(chalk.gray(msg));
  }
}

export function exec(command) {
  execSync(command, { stdio: 'inherit', cwd: appRootDir.get() });
}
