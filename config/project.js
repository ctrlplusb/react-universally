/* @flow */

// Project configuration settings.

const pathResolve = require('path').resolve;
const appRootPath = require('app-root-dir').get();
const envVars = require('./utils/envVars');

if (process.env.IS_CLIENT) {
  throw new Error(
    'You are importing the application configuration into the client bundle! This is super dangerous as you will essentially be exposing all your internals/logins/etc to the world.  If you need some configuration that will be consumed by the client bundle then add it to the clientSafe configuration file.'
  );
}

const buildOutputPath = pathResolve(appRootPath, 'build');
const clientBundleName = 'client';
const clientPublicPath = `/${clientBundleName}/`;
const serverBundleName = 'server';
const vendorDLLName = '__dev_vendor_dll__';
const serviceWorkerFilename = 'sw.js';

module.exports = {
  // SSR enabled?
  ssrEnabled: true,

  // Where does our build output go?
  buildOutputPath,

  // Configuration settings for the service worker.
  serviceWorker: {
    // Enable the service worker?
    enabled: true,
    // Service worker filename
    filename: serviceWorkerFilename,
    // When a user has no internet connectivity and a path is not available
    // in our service worker cache then the following file will be
    // served to them.  Go and make it pretty. :)
    navigateFallbackURL: '/offline.html',
  },

  // Client bundle specific configuration.
  client: {
    // Where should we output the bundle?
    outputPath: pathResolve(buildOutputPath, clientBundleName),
    // What should we name the json output file that webpack generates containing
    // details of all output files for a bundle?
    assetsFilename: 'assets.json',
    // What is the public http path at which we must serve our client from?
    publicPath: clientPublicPath,
  },

  // Server bundle specific configuration.
  server: {
    // The protocol for the server.
    protocol: envVars.SERVER_PROTOCOL || 'http',
    // The host endpoint for the server.
    host: envVars.SERVER_HOST || 'localhost',
    // The output path for the bundle.
    outputPath: pathResolve(buildOutputPath, serverBundleName),
    // What port must the server run on?
    port: envVars.SERVER_PORT
      ? parseInt(envVars.SERVER_PORT, 10)
      : 1337,
    // How long should we set the browser cache for the served assets?
    // Don't worry, we add hashes to the files, so if they change the new files
    // will be served to browsers.
    // We are using the "ms" format to set the length.
    // @see https://www.npmjs.com/package/ms
    cacheMaxAge: '365d',
    // Path to the public assets that will be served off the root of the
    // HTTP server.
    publicAssetsPath: pathResolve(appRootPath, '/public'),
  },

  // Development specific configuration.
  development: {
    // We run a seperate webpack process for our client bundle. What port should
    // it run on?
    clientDevServerPort: envVars.CLIENT_DEVSERVER_PORT
      ? parseInt(envVars.CLIENT_DEVSERVER_PORT, 10)
      : 7331,

    // Configuration settings for the vendor DLL.  This is automatically created
    // by our development server and provides an improved development experience
    // by decreasing the module load that webpack needs to recompile every time
    // you make a code change.
    vendorDLL: {
      // Use a development vendor DLL? This improves webpack build performance
      // which leads to an overall improved developer experience.  However, they
      // may be a case in which you want all the vendor DLLs bundled with your
      // main client bundle.
      enabled: true,
      // It is also possible that certain vendor DLLs require specific webpack
      // related features (e.g. CSS/SASS etc).  For these cases you don't want to
      // include them in the vendor dll, which has a very simple webpack
      // configuration. To ensure that the respective bundles are always compiled
      // with your main client bundle then add them to the property below.  You
      // can add multiple items, comma seperated.
      ignores: ['normalize.css/normalize.css'],
      // The name of the vendor DLL file that gets generated.
      name: vendorDLLName,
      // The name of the hash file we will use to check to see if new dependencies
      // have been installed and therefore the vendor DLL should be regenerated.
      hashFilename: `${vendorDLLName}__hash__`,
      // The web path at which the vendor DLL will be served from.
      webPath: `${clientPublicPath}${vendorDLLName}.js`,
    },
  },
};
