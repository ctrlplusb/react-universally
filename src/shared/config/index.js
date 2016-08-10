/* @flow */

// Contains all the configuration shared between our Server and Client.
// Please note that the DefinePlugin of webpack will inline/replace all the
// respective "process.env.*" variables below with the actual values.
// Therefore these config values then become a part of the server and client
// bundles - so please ensure you don't put sensitive config values in here.
// Most likely if you are dealing with a sensitive config value (e.g db pass)
// then it should go in the specific /src/server/config which will only be
// contained in the server bundle.

const isDevelopment = process.env.NODE_ENV === 'development';
export const IS_DEVELOPMENT = isDevelopment;

export const IS_HOT_DEVELOPMENT = isDevelopment && module.hot;
