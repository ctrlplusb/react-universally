/* @flow */
/* eslint-disable no-console */

// The identifier of the property we should bind the config to.
export const CLIENT_CONFIG_IDENTIFIER = '__CLIENT_CONFIG__';

// We cache the filtered client specific config values to avoid unnecessary
// CPU cycle usage.
let clientConfigScriptCache;

// Generates an inline script tag.
const inlineScript = (nonce, content) =>
  `<script ${nonce ? `nonce="${nonce}"` : ''} type="text/javascript">
    ${content}
  </script>`;

// This resolves the correct configuration source based on the execution
// environment.  For node we use the values file, for browsers we need
// to access the window bound object.
// We have clever usage of "process.env" within here so that code blocks will
// be removed depending on our target bundle being built.
const config = (() => {
  // If no "IS_NODE" env var is set we can assume that we are running outside
  // of a webpack run, and will therefore return the values file.
  if (typeof process.env.IS_NODE === 'undefined' || process.env.IS_NODE) {
    // i.e. running in our server/node process.
    return require('./values').default;
  }

  // i.e. running in the browser.
  if (typeof window !== 'undefined' && typeof window[CLIENT_CONFIG_IDENTIFIER] !== 'undefined') {
    return window[CLIENT_CONFIG_IDENTIFIER];
  }
  console.warn('No client configuration object was bound to the window.');
  return {};
})();

/**
 * Generates an inline HTML script tag containing the required intialization of
 * the global configuration variable for the client/browser.
 * We have clever usage of "process.env" within here so that code blocks will
 * be removed depending on our target bundle being built.
 */
export function clientConfigScript(nonce? : string) {
  // If no "IS_NODE" env var is set we can assume that we are running outside
  // of a webpack run, and will therefore return the values file.
  if (typeof process.env.IS_NODE === 'undefined' || process.env.IS_NODE) {
    if (clientConfigScriptCache) {
      return inlineScript(nonce, clientConfigScriptCache);
    }

    const serialize = require('serialize-javascript');
    const { default: values, allowedForClient } = require('./values');

    // Recursive function that applies the allowedForClient rules to create
    // a new filtered values object that can be serialized for the client.
    const filterValues = (vals, rules, basePropPath = '') =>
      Object.keys(rules).reduce((acc, key) => {
        const propPath = basePropPath !== '' ? `${basePropPath}.${key}` : key;

        // $FlowFixMe
        if (typeof rules[key] === 'object') {
          // $FlowFixMe
          if (typeof vals[key] !== 'object') {
            throw new Error(`Expected config value at path "${propPath}" to be an object`);
          }
          acc[key] = filterValues(vals[key], rules[key], propPath); // eslint-disable-line no-param-reassign,max-len
        } else if (rules[key]) {
          // $FlowFixMe
          if (!vals[key]) {
            throw new Error(`You specified an allowed path of "${propPath}" for the exposure of configuration to the client bundle, however this path was not found in the config values.`);
          }
          acc[key] = vals[key]; // eslint-disable-line no-param-reassign
        }
        return acc;
      }, {});

    // Get the values.
    const clientConfigValues = filterValues(values, allowedForClient);
    // Set the cache.
    clientConfigScriptCache = `window.${CLIENT_CONFIG_IDENTIFIER} = ${serialize(clientConfigValues)};`;
    // Return the scripted values.
    return inlineScript(nonce, clientConfigScriptCache);
  }

  throw new Error('You should not execute "clientConfigScript" within a client bundle.');
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
 *   import { get } from '../config';
 *   console.log(get('foo', 'bar'));
 *
 * If any part of the path isn't available as a configuration key/value then
 * `undefined` will be returned.
 */
export function get(...path : Array<string>) : any {
  if (path.length === 0) {
    throw new Error('You must provide the configuration value path.');
  }
  let result = config;
  for (let i = 0; i < path.length; i += 1) {
    if (result === undefined) {
      throw new Error(`Failed to resolve config value at "${path.join('.')}"`);
    }
    result = result[path[i]];
  }
  return result;
}
