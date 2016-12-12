/* @flow */

// Project configuration.
//
// General project configuration as well as values that are used in multiple
// places across the project. It is useful not to have duplicated strings/values
// scattered across our project. A centralised configuration allows for easier
// changes/refactoring.
//
// Note: all file/folder paths should be relative to the project root. The
// absolute paths should be resolved during runtime by our build tools/server.

export default {
  // Base name of the optional environment configuration file.
  envFileName: '.env',

  // How long should we set the browser cache for the served assets?
  // Don't worry, we add hashes to the files, so if they change the new files
  // will be served to browsers.
  // We are using the "ms" format to set the length.
  // @see https://www.npmjs.com/package/ms
  browserCacheMaxAge: '365d',

  // Path to the public assets that will be served off the root of the
  // HTTP server.
  publicAssetsPath: './public',

  // Where does our build output live?
  buildOutputPath: './build',

  // Should we optimize production builds (i.e. minify etc).
  // Sometimes you don't want this to happen to aid in debugging complex
  // problems.  Having this configuration flag here allows you to quickly
  // toggle the feature.
  optimizeProductionBuilds: true,

  // Do you want to included source maps (will be served as seperate files)
  // for production builds?
  includeSourceMapsForProductionBuilds: false,

  // Path to the shared src between the bundles.
  bundlesSharedSrcPath: './src/shared',

  // These extensions are tried when resolving src files for our bundles..
  bundleSrcTypes: ['js', 'jsx', 'json'],

  // Additional asset types to be supported for our bundles.
  // i.e. you can import the following file types within your source and the
  // webpack bundling process will bundle them with your source and create
  // URLs for them that can be resolved at runtime.
  bundleAssetTypes: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'ico',
    'eot',
    'svg',
    'ttf',
    'woff',
    'woff2',
    'otf',
  ],

  // What should we name the json output file that webpack generates
  // containing details of all output files for a bundle?
  bundleAssetsFileName: 'assets.json',

  // Extended configuration for the Content Security Policy (CSP)
  // @see src/server/middleware/security for more info.
  cspExtensions: {
    defaultSrc: [],
    scriptSrc: [],
    styleSrc: [],
    imgSrc: [],
    connectSrc: [],
    fontSrc: [],
    objectSrc: [],
    mediaSrc: [],
    childSrc: [],
  },

  // node_modules are not included in any bundles that target "node" as a runtime
  // (i.e. the server bundle).
  // The node_modules may however contain files that will need to be processed by
  // one of our webpack loaders.
  // Add any required file types to the list below.
  nodeBundlesIncludeNodeModuleFileTypes: [
    /\.(eot|woff|woff2|ttf|otf)$/,
    /\.(svg|png|jpg|jpeg|gif|ico)$/,
    /\.(mp4|mp3|ogg|swf|webp)$/,
    /\.(css|scss|sass|sss|less)$/,
  ],

  // Note: you can only have a single service worker instance.  Our service
  // worker implementation is bound to the "client" and "server" bundles.
  // It includes the "client" bundle assets, as well as the public folder assets,
  // and it is served by the "server" bundle.
  serviceWorker: {
    // Service worker name
    fileName: 'sw.js',
    // Paths to the public assets which should be included within our
    // service worker. Relative to our public folder path, and accepts glob
    // syntax.
    includePublicAssets: [
      // NOTE: This will include ALL of our public folder assets.  We do
      // a glob pull of them and then map them to /foo paths as all the
      // public folder assets get served off the root of our application.
      // You may or may not want to be including these assets.  Feel free
      // to remove this or instead include only a very specific set of
      // assets.
      './**/*',
    ],
    // Path to the template used by HtmlWebpackPlugin to generate an offline
    // page that will be used by the service worker to render our application
    // offline.
    offlinePageTemplate: './tools/webpack/offlinePage',
    // Offline page file name.
    offlinePageFileName: 'offline.html',
  },

  bundles: {
    client: {
      // Src entry file.
      srcEntryFile: './src/client/index.js',

      // Src paths.
      srcPaths: [
        './src/client',
        './src/shared',
        './config/public',
      ],

      // Where does the client bundle output live?
      outputPath: './build/client',

      // What is the public http path at which we must serve the bundle from?
      webPath: '/client/',

      // Configuration settings for the development vendor DLL.  This will be created
      // by our development server and provides an improved dev experience
      // by decreasing the number of modules that webpack needs to process
      // for every rebuild of our client bundle.
      devVendorDLL: {
        // Enabled?
        enabled: true,

        // Any source files that match the following regular expressions will
        // not be considered when trying to find out which modules are used
        // for the client bundle.
        // Typically you want to exclude test files as they may contain
        // modules which are node specific.
        srcFileIgnores: [
          /.*\.test\.js$/ig,
          /.*-test\.js$/i,
        ],

        // It is also possible that some modules require specific
        // webpack loaders in order to be processed (e.g. CSS/SASS etc).
        // For these cases you don't want to include them in the vendor dll,
        // which has a very simple loader configuration.
        // Add the respective modules to the ignores list below to ensure
        // that they don't get bundled into the vendor DLL.
        ignores: ['normalize.css/normalize.css'],

        // The name of the vendor DLL.
        name: '__dev_vendor_dll__',
      },
    },

    server: {
      // Src entry file.
      srcEntryFile: './src/server/index.js',

      // Src paths.
      srcPaths: [
        './src/server',
        './src/shared',
        './config/private',
        './config/public',
      ],

      // Where does the server bundle output live?
      outputPath: './build/server',
    },
  },

  additionalNodeBundles: {
    // NOTE: The webpack configuration and build scripts have been built so
    // that you can add arbitrary additional node bundle configurations here.
    //
    // A common requirement for larger projects is to add additional "node"
    // target bundles (e.g an APi server endpoint). Therefore flexibility has been
    // baked into our webpack config factory to allow for this.
    //
    // Simply define additional configurations similar to below.  The development
    // server will manage starting them up for you.  The only requirement is that
    // within the entry for each bundle you create and return the "express"
    // listener.
    /*
    apiServer: {
      srcEntryFile: './src/api/index.js',
      srcPaths: [
        './src/api',
        './src/shared',
        './config',
      ],
      outputPath: './build/api',
    }
    */
  },
};
