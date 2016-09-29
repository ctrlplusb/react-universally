/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */

const notifier = require('node-notifier');

function createNotification(options = {}) {
  const title = options.title
    ? `🔥  ${options.title.toUpperCase()}`
    : undefined;

  notifier.notify({
    title,
    message: options.message,
    open: options.open,
  });

  console.log(`==> ${title} -> ${options.message}`);
}

module.exports = createNotification;
