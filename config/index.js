/* @flow */

// Application Configuration.
//
// Please see the /docs/ApplicationConfig.md documentation for more info.
//
// Note: all file/folder paths should be relative to the project root. The
// absolute paths should be resolved during runtime by our build tools/server.

import { getStringEnvVar, getIntEnvVar } from './internals/environmentVars';
import filterObject from './internals/filterObject';
import type { BuildOptions } from '../tools/types';

// This protects us from accidentally including this configuration in our
// client bundle. That would be a big NO NO to do. :)
if (process.env.IS_CLIENT) {
  throw new Error("You shouldn't be importing the `./config` directly into your 'client' or 'shared' source as the configuration object will get included in your client bundle. Not a safe move! Instead, use the `safeConfigGet` helper function (located at `./src/shared/utils/config`) within the 'client' or 'shared' source files to reference configuration values in a safe manner.");
}

const config = {
  // The host on which the server should run.
  host: getStringEnvVar('SERVER_HOST', 'localhost'),

  // The port on which the server should run.
  port: getIntEnvVar('SERVER_PORT', 1337),

  // The port on which the client bundle development server should run.
  clientDevServerPort: getIntEnvVar('CLIENT_DEVSERVER_PORT', 7331),

  // This is an example environment variable which is consumed within the
  // './client.js' config.  See there for more details.
  welcomeMessage: getStringEnvVar('WELCOME_MSG', 'Hello world!'),

  // Disable server side rendering?
  disableSSR: false,

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
    // Enabled?
    enabled: true,
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

  // We use the polyfill.io service which provides the polyfills that a
  // client needs, which is far more optimal than the large output
  // generated by babel-polyfill.
  // Note: we have to keep this seperate from our "htmlPage" configuration
  // as the polyfill needs to be loaded BEFORE any of our other javascript
  // gets parsed.
  polyfillIO: {
    enabled: true,
    url: 'https://cdn.polyfill.io/v2/polyfill.min.js',
  },

  // Configuration for the HTML pages (headers/titles/scripts/css/etc).
  // We make use of react-helmet to consume the values below.
  // @see https://github.com/nfl/react-helmet
  htmlPage: {
    htmlAttributes: { lang: 'en' },
    titleTemplate: 'React, Universally - %s',
    defaultTitle: 'React, Universally',
    meta: [
      {
        name: 'description',
        content: 'A starter kit giving you the minimum requirements for a production ready universal react application.',
      },
      // Default content encoding.
      { name: 'charset', content: 'utf-8' },
      // @see http://bit.ly/2f8IaqJ
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      // This is important to signify your application is mobile responsive!
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // Providing a theme color is good if you are doing a progressive
      // web application.
      { name: 'theme-color', content: '#2b2b2b' },
    ],
    links: [
      // When building a progressive web application you need to supply
      // a manifest.json as well as a variety of icon types. This can be
      // tricky. Luckily there is a service to help you with this.
      // http://realfavicongenerator.net/
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
      { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#00a9d9' },
      // Make sure you update your manifest.json to match your application.
      { rel: 'manifest', href: '/manifest.json' },
    ],
    scripts: [
      // Example:
      // { src: 'http://include.com/pathtojs.js', type: 'text/javascript' },
    ],
  },

  bundles: {
    client: {
      // Src entry file.
      srcEntryFile: './src/client/index.js',

      // Src paths.
      srcPaths: [
        './src/client',
        './src/shared',
        // The service worker offline page generation needs access to the
        // config folder.  Don't worry we have guards within the config files
        // to ensure they never get included in a client bundle.
        './config',
      ],

      // Where does the client bundle output live?
      outputPath: './build/client',

      // What is the public http path at which we must serve the bundle from?
      webPath: '/client/',

      // Configuration settings for the development vendor DLL.  This will be created
      // by our development server and provides an improved dev experience
      // by decreasing the number of modules that webpack needs to process
      // for every rebuild of our client bundle.  It by default uses the
      // dependencies configured in package.json however you can customise
      // which of these dependencies are excluded, whilst also being able to
      // specify the inclusion of additional modules below.
      devVendorDLL: {
        // Enabled?
        enabled: true,

        // It is also possible that some modules require specific
        // webpack loaders in order to be processed (e.g. CSS/SASS etc).
        // For these cases you don't want to include them in the vendor dll,
        // which has a very simple loader configuration.
        // Add the respective modules to the ignores list below to ensure
        // that they don't get bundled into the vendor DLL.
        ignores: ['normalize.css/normalize.css'],

        // Which libaries should be excluded when interpreting the package.json
        // dependencies?
        //
        // You should exclude dependencies meant for a server/node process and
        // you should also exclude modules that may contain files requiring a
        // webpack loader to parse them (e.g. CSS/SASS etc).
        exclude: [
          // Requires webpack loaders:
          'normalize.css',

          // Only used by node/server:
          'app-root-dir',
          'colors',
          'compression',
          'dotenv',
          'express',
          'helmet',
          'hpp',
          'offline-plugin',
          'serialize-javascript',
          'source-map-support',
          'uuid',
          'user-home',
        ],

        // Specify any additional dependencies that you would like to
        // explicitly include.
        include: [],

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
        './config',
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

  // These plugin definitions provide you with advanced hooks into customising
  // the project without having to reach into the internals of the tools.
  //
  // We have decided to create this plugin approach so that you can come to
  // a centralised configuration folder to do most of your application
  // configuration adjustments.  Additionally it helps to make merging
  // from the origin starter kit a bit easier.
  plugins: {
    // This is used to resolve the babel configuration used to transpile the
    // source bundles for development/production modes.
    //
    // Please use the provided values and then ensure that you return the
    // appropriate values for the given target and mode.
    babelConfig: (buildOptions : BuildOptions) => {
      const { target, mode } = buildOptions;

      return {
        // We need to ensure that we do this otherwise the babelrc will
        // get interpretted and for the current configuration this will mean
        // that it will kill our webpack treeshaking feature as the modules
        // transpilation has not been disabled within in.
        babelrc: false,

        presets: [
          // JSX
          'react',
          // Stage 3 javascript syntax.
          // "Candidate: complete spec and initial browser implementations."
          // Add anything lower than stage 3 at your own risk. :)
          'stage-3',
          // For our client bundles we transpile all the latest ratified
          // ES201X code into ES5, safe for browsers.  We exclude module
          // transilation as webpack takes care of this for us, doing
          // tree shaking in the process.
          target === 'client'
            ? ['latest', { es2015: { modules: false } }]
            : null,
          // For our server bundle we use the awesome babel-preset-env which
          // acts like babel-preset-latest in that it supports the latest
          // ratified ES201X syntax, however, it will only transpile what
          // is necessary for a target environment.  We have configured it
          // to target our current node version.  This is cool because
          // recent node versions have extensive support for ES201X syntax.
          // Also, we have disabled modules transpilation as webpack will
          // take care of that for us ensuring tree shaking takes place.
          // NOTE: Make sure you use the same node version for development
          // and production.
          target === 'server'
            ? ['env', { targets: { node: true }, modules: false }]
            : null,
        ].filter(x => x != null),

        plugins: [
          // Required to support react hot loader.
          mode === 'development'
            ? 'react-hot-loader/babel'
            : null,
          // This decorates our components with  __self prop to JSX elements,
          // which React will use to generate some runtime warnings.
          mode === 'development'
            ? 'transform-react-jsx-self'
            : null,
          // Adding this will give us the path to our components in the
          // react dev tools.
          mode === 'development'
            ? 'transform-react-jsx-source'
            : null,
          // The following plugin supports the code-split-component
          // instances, taking care of all the heavy boilerplate that we
          // would have had to do ourselves to get code splitting w/SSR
          // support working.
          // @see https://github.com/ctrlplusb/code-split-component
          //
          // We only include it in production as this library does not support
          // React Hot Loader, which we use in development.
          mode === 'production' && (target === 'server' || target === 'client')
            ? [
              'code-split-component/babel',
              {
                // For our server bundle we will set the mode as being 'server'
                // which will ensure that our code split components can be
                // resolved synchronously, being much more helpful for
                // pre-rendering.
                mode: target,
              },
            ]
            : null,
        ].filter(x => x != null),
      };
    },

    // This plugin allows you to provide final adjustments your webpack
    // configurations for each bundle before they get processed.
    //
    // I would recommend looking at the "webpack-merge" module to help you with
    // merging modifications to each config.
    //
    // This function will be called once for each for your bundles.  It will be
    // provided the current webpack config, as well as the buildOptions which
    // detail which bundle and mode is being targetted for the current function run.
    webpackConfig: (webpackConfig: Object, buildOptions : BuildOptions) => {
      const { target, mode } = buildOptions; // eslint-disable-line no-unused-vars

      // Example:
      /*
      if (target === 'server' && mode === 'development') {
        webpackConfig.plugins.push(new MyCoolWebpackPlugin());
      }
      */

      // Debugging/Logging Example:
      /*
      if (target === 'server') {
        console.log(JSON.stringify(webpackConfig, null, 4));
      }
      */

      return webpackConfig;
    },
  },
};

// Export the client configuration object.
export const clientConfig = filterObject(
  // We will filter our full application configuration object...
  config,
  // using the rules below in order to create our filtered client configuration
  // object.
  //
  // This object will be bound to the window.__CLIENT_CONFIG__
  // property which is where client code should be referencing it from.
  // As we generally have shared code between our node/browser code we have
  // created a helper function in "./src/shared/utils/config" that you can used
  // to request config values from.  It will make sure that either the
  // application config file is used (i.e. this file), or the
  // window.__CLIENT_CONFIG__ is used.  This avoids boilerplate throughout your
  // shared code.  We recommend using this helper anytime you need a config
  // value within either the "client" or "shared" folder (i.e. any folders
  // that contain code which will end up in the browser).
  //
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
  {
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
  },
);

// Export the main config as the default export.
export default config;
