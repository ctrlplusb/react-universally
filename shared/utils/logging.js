/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */

import chalk from 'chalk';

export function log(options) {
  const level = options.level || 'info';
  const msg = options.message;

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
