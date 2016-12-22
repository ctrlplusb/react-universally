/* @flow */

// This is a filter that will be applied to our configuration in order to
// determine which of our configuration values will be provided to the client
// bundle.
//
// For security reasons you wouldn't want to make all of the configuration values
// accessible by client bundles as these values would essentially be getting
// transported over the wire to user's browsers.  There are however cases
// where you may want to expose one or two of the values within a client bundle.
//
// This filter object must match the shape of the configuration object, however
// you need not specify every property that is defined within the configuration
// object.  Simply define the properties you would like to be included in the
// client config, supplying a truthy value to them in order to ensure they
// get included in the client bundle.
export default {
  // This is here as an example showing that you can expose environment
  // variables too.
  welcomeMessage: true,
  // We only need to expose the enabled flag of the service worker.
  serviceWorker: {
    enabled: true,
  },
  // We need to expose all the polyfill.io settings.
  polyfillIO: true,
  // We need to expose all the htmlPage settings.
  htmlPage: true,
  additionalNodeBundles: true,
};
