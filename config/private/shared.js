/* @flow */

// Typically you will need to have some configuration values that are shared
// across your client/server (i.e. consumed within the "shared" folder). For
// example you may have the URL to a 3rd party API you would like to hit, or
// you may have an environment variable set that allows you to do some sort of
// feature toggling.
//
// The easy way to bind configuration values to each of your bundles is to
// use Webpack's DefinePlugin.  However, this solution is limited as it only
// allows build time interpretation of your configuration values.  This is
// very restrictive causing you issues when you would like a configuration value
// that changes on each of your executing environments.
//
// So how do we access configuration in a client bundle?
//
// We propose the following strategy:
//
// Firstly, put all shared configuration in this file. This allows you to
// easily track and manage the items that will be shared across the client/
// server.  This is especially important as you don't want to accidentally
// include sensitive configuration (e.g. db string) within the client.
//
// Then, when the server generates the HTML response for a request it will
// create an inline script that will bind this shared configuration object
// against the "window" object.
// e.g. <script>window.__CLIENT_CONFIG__ = serialize({...});</script>
//
// With the configuration being sent dynamically for each request it allows
// any environment/runtime configuration values to be interpreted and
// provided.  An improvement on the DefinePlugin approach. :)
//
// Then to access this shared configuration within your source use the provided
// /src/shared/getSharedConfig helper that will take care of all the boilerplate
// you would need to do to make sure you access the config in the correct
// manner depending on if it is a client/server bundle.

import projConfig from './project';
import envConfig from './environment';

// The config.
export default {
  serviceWorker: {
    enabled: projConfig.serviceWorker.enabled,
  },
  // Here is an example environment variable.
  welcomeMessage: envConfig.welcomeMessage,
};
