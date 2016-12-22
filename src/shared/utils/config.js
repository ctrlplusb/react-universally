/* @flow */
/* eslint-disable no-console */
/* eslint-disable import/global-require */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

// This resolves the correct configuration source based on the execution
// environment.  For node we use the standard config file, however, for browsers
// we need to access the configuration object that would have been bound to
// the "window" by our "reactApplication" middleware.
let configCache;
function resolveConfigForExecutionEnv() {
  if (configCache) {
    return configCache;
  }

  // NOTE: By using the "process.env.IS_NODE" flag here this block of code
  // will be removed when "process.env.ISNODE === true".
  // If no "IS_NODE" env var is undefined we can assume that we are running outside
  // of a webpack run, and will therefore return the config file.
  if (typeof process.env.IS_NODE === 'undefined' || process.env.IS_NODE) {
    // i.e. running in our server/node process.
    configCache = require('../../../config').default;
    return configCache;
  }

  // To get here we are likely running in the browser.

  if (typeof window !== 'undefined'
    && typeof window.__CLIENT_CONFIG__ === 'object') {
    configCache = window.__CLIENT_CONFIG__;
  } else {
    // To get here we must be running in the browser.
    console.warn('No client configuration object was bound to the window.');
    configCache = {};
  }

  return configCache;
}

/**
 * This function wraps up the access to the configuration. It allows you to
 * use the same API to access configuration without worrying about the
 * internal context switching that needs to occur depending on whether you
 * are executing within a node or browser environment.
 *
 * i.e.
 *  - in the browser config values are available at window[CLIENT_CONFIG_IDENTIFIER]
 *  - in a node process you need to require the ./values.js file directly.
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
 *   import { safeConfigGet } from '../config';
 *   console.log(safeConfigGet(['foo', 'bar']));
 *
 * If any part of the path isn't available as a configuration key/value then
 * `undefined` will be returned.
 */
export function safeConfigGet(path : Array<string>) : any {
  if (path.length === 0) {
    throw new Error('You must provide the path to the configuration value you would like to consume.');
  }
  let result = resolveConfigForExecutionEnv();
  for (let i = 0; i < path.length; i += 1) {
    if (result === undefined) {
      const errorMessage = `Failed to resolve configuration value at "${path.join('.')}".`;
      if (process.env.NODE_ENV === 'development' && process.env.IS_CLIENT) {
        throw new Error(`${errorMessage} We have noticed that you are trying to access this configuration value from the client bundle (i.e. browser) though.  For configuration values to be exposed to the client bundle you must ensure that the path is added to the client configuration filter file, which is located at "config/clientConfigFilter.js".`);
      }
      throw new Error(errorMessage);
    }
    result = result[path[i]];
  }
  return result;
}
