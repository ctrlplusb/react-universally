/* @flow */
/* eslint-disable no-console */

import { CLIENT_CONFIG_IDENTIFIER } from './constants';

const config = (() => {
  if (process.env.IS_NODE) {
    // i.e. running in our server/node process.
    return require('../../config/private/shared').default;
  }

  // i.e. running in the browser.
  if (typeof window[CLIENT_CONFIG_IDENTIFIER] !== 'undefined') {
    return window[CLIENT_CONFIG_IDENTIFIER];
  }
  console.warn('No shared configuration object was bound to the window.');
  return {};
})();

/**
 * This function wraps up the access to the the shared configuration, which
 * depending on the executing environment accessed in a different manner.
 *
 * i.e.
 *  - in the browser you need to access it via window[CLIENT_CONFIG_IDENTIFIER]
 *  - in a node process you need to require the shared config file directly.
 *
 * To avoid this boilerplate throughout your code you can use this function.
 *
 * It expects a path to the respective configuration value.
 *
 * If you had the following configuration:
 *   {
 *     foo: {
 *       bar: [1, 2, 3]
 *     }
 *   }
 *
 * You could use this function to access "bar" like so:
 *   import getSharedConfig from '../shared/getSharedConfig';
 *   console.log(getSharedConfig('foo', 'bar'));
 *
 * If any part of the path doesn't exist you will get back `undefined`;
 */
export default function getSharedConfig(...paths : Array<string>) {
  if (paths.length === 0) {
    throw new Error('You must provide the configuration value path to getSharedConfig');
  }
  let result = config;
  for (let i = 0; i < paths.length; i += 1) {
    if (result === undefined) {
      return undefined;
    }
    result = result[paths[i]];
  }
  return result;
}
