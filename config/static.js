/* @flow */

// Static project configuration.
//
// General application configuration as well as values that are used in multiple
// places across the project (e.g. build output paths etc). It is useful not to
// have duplicated strings/values scattered across our project, with this
// centralised configuration allowing for easier updates.
//
// Note: all file/folder paths should be relative to the project root. The
// absolute paths should be resolved during runtime by our build tools/server.

export default {
  // Where does the [optional] environment setting files live?
  envFilePath: './.env',

  // How long should we set the browser cache for the served assets?
  // Don't worry, we add hashes to the files, so if they change the new files
  // will be served to browsers.
  // We are using the "ms" format to set the length.
  // @see https://www.npmjs.com/package/ms
  cacheMaxAge: '365d',

  // Path to the public assets that will be served off the root of the
  // HTTP server.
  publicAssetsPath: './public',

  // Where does our build output live?
  buildOutputPath: './build',

  // Should we optimize production builds (i.e. minify etc).
  // Sometimes you don't want this to happen to aid in debugging complex
  // problems.  Having this configuration flag here allows you to quickly
  // toggle the feature.
  optimizeProductionBuilds: false,

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

  serviceWorker: {
    // Service worker name
    fileName: 'sw.js',

    // Web path.
    webPath: '/sw.js',

    // When a user has no internet connectivity and a path is not available
    // in our service worker cache then the following file will be
    // served to them.  Go and make it pretty. :)
    navigateFallbackURL: '/offline.html',

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
  },

  clientBundle: {
    // Client src path.
    srcPath: './src/client',

    // Where does the client bundle output live?
    outputPath: './build/client',

    // What should we name the json output file that webpack generates
    // containing details of all output files for a bundle?
    assetsFileName: 'assets.json',

    // What is the public http path at which we must serve the bundle from?
    webPath: '/client/',
  },

  serverBundle: {
    // Server src path.
    srcPath: './src/server',

    // Where does the server bundle output live?
    outputPath: './build/server',

    // We don't want our node_modules to be bundled with our server package,
    // prefering them to be resolved via native node module system.  Therefore
    // we use the `webpack-node-externals` library to help us generate an
    // externals config that will ignore all node_modules.
    // However the node_modules may contain files that will rely on our
    // webpack loaders in order to be used/resolved, for example CSS or
    // SASS. For these cases please make sure that the file extensions
    // are added to the below list. We have added the most common formats.
    externalsWhitelist: [
      /\.(eot|woff|woff2|ttf|otf)$/,
      /\.(svg|png|jpg|jpeg|gif|ico)$/,
      /\.(mp4|mp3|ogg|swf|webp)$/,
      /\.(css|scss|sass|sss|less)$/,
    ],
  },

  development: {
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
      name: '__dev_vendor_dll__',

      // The web path at which the vendor DLL will be served from.
      webPath: '/client/__dev_vendor_dll__.js',
    },
  },
};
