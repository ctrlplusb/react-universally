/* @flow */

// Application configuration.

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import { ensureNotInClientBundle, getEnvVars } from './utils';

const appRootPath = appRootDir.get();

ensureNotInClientBundle();

// Get possible environment configuration variables.
const envVars = getEnvVars();

const buildOutputPath = pathResolve(appRootPath, 'build');
const clientBundleName = 'client';
const clientBundlePath = pathResolve(buildOutputPath, clientBundleName);
const clientBundleWebRoot = `/${clientBundleName}/`;
const clientBundleAssetsJSONFilename = 'assets.json';
const serverBundleName = 'server';
const vendorDLLName = '__dev_vendor_dll__';
const serviceWorkerName = 'sw';

export default {
  // SSR enabled?
  ssrEnabled: true,

  // Configuration settings for the service worker.
  serviceWorker: {
    // Enable the service worker?
    enabled: true,
    // Service worker name
    name: serviceWorkerName,
    // When a user has no internet connectivity and a path is not available
    // in our service worker cache then the following file will be
    // served to them.  Go and make it pretty. :)
    navigateFallbackURL: '/offline.html',
  },

  // Client bundle specific configuration.
  client: {
    // What should we name the json output file that webpack generates containing
    // details of all output files for a bundle?
    assetsFilename: clientBundleAssetsJSONFilename,
    // What is the public http path at which we must serve our client from?
    webRoot: clientBundleWebRoot,
  },

  // Server bundle specific configuration.
  server: {
    // The host endpoint for the server.
    host: envVars.SERVER_HOST || 'localhost',
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
      // The web path at which the vendor DLL will be served from.
      webPath: `${clientBundleWebRoot}${vendorDLLName}.js`,
    },
  },

  // Pre-resolved paths that can then be easily referenced throughout the project
  // without having to resolve them in multiple places.
  paths: {
    // Where does our build output live?
    buildOutput: buildOutputPath,
    // Where does the client bundle output live?
    clientBundle: clientBundlePath,
    // The assets json file for the client bundle.
    clientBundleAssetsJSON: pathResolve(
      clientBundlePath, clientBundleAssetsJSONFilename,
    ),
    // Where does the server bundle output live?
    serverBundle: pathResolve(buildOutputPath, serverBundleName),
    // Path to the public assets that will be served off the root of the
    // HTTP server.
    publicAssets: pathResolve(appRootPath, '/public'),
    // The package.json file path
    packageJSON: pathResolve(appRootPath, 'package.json'),
    // The hash file for the vendor DLL.
    vendorDLLHash: pathResolve(clientBundlePath, `${vendorDLLName}__hash__`),
    // The vendor DLL JSON file.
    vendorDLLJSON: pathResolve(clientBundlePath, `${vendorDLLName}.json`),
    // Client src
    clientSrc: pathResolve(appRootPath, './src/client'),
    // Server src
    serverSrc: pathResolve(appRootPath, './src/server'),
    // Shared src
    sharedSrc: pathResolve(appRootPath, './src/shared'),
    // The service worker.
    serviceWorker: pathResolve(clientBundlePath, `${serviceWorkerName}.js`),
    // The webpack bundle analyze stats file.
    bundleAnalyze: pathResolve(buildOutputPath, 'client-analyze.json'),
  },
};
