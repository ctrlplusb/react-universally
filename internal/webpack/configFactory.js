import appRootDir from 'app-root-dir';
import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';

import { happyPackPlugin, log } from '../utils';
import { ifElse } from '../../shared/utils/logic';
import { mergeDeep } from '../../shared/utils/objects';
import { removeNil } from '../../shared/utils/arrays';
import withServiceWorker from './withServiceWorker';
import config from '../../config';

/**
 * Generates a webpack configuration for the target configuration.
 *
 * This function has been configured to support one "client/web" bundle, and any
 * number of additional "node" bundles (e.g. our "server").  You can define
 * additional node bundles by editing the project confuguration.
 com
 * @param  {Object} buildOptions - The build options.
 * @param  {target} buildOptions.target - The bundle target (e.g 'clinet' || 'server').
 * @param  {target} buildOptions.optimize - Build an optimised version of the bundle?
 *
 * @return {Object} The webpack configuration.
 */
export default function webpackConfigFactory(buildOptions) {
  const { target, optimize = false } = buildOptions;

  const isProd = optimize;
  const isDev = !isProd;
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isNode = !isClient;

  // Preconfigure some ifElse helper instnaces. See the util docs for more
  // information on how this util works.
  const ifDev = ifElse(isDev);
  const ifProd = ifElse(isProd);
  const ifNode = ifElse(isNode);
  const ifClient = ifElse(isClient);
  const ifDevClient = ifElse(isDev && isClient);
  const ifProdClient = ifElse(isProd && isClient);

  log({
    level: 'info',
    title: 'Webpack',
    message: `Creating ${
      isProd ? 'an optimised' : 'a development'
    } bundle configuration for the "${target}"`,
  });

  const bundleConfig =
    isServer || isClient
      ? // This is either our "server" or "client" bundle.
        config(['bundles', target])
      : // Otherwise it must be an additional node bundle.
        config(['additionalNodeBundles', target]);

  if (!bundleConfig) {
    throw new Error('No bundle configuration exists for target:', target);
  }

  let webpackConfig = {
    // Webpack Mode
    mode: ifDev('development', 'production'),
    // Define our entry chunks for our bundle.
    entry: {
      // We name our entry files "index" as it makes it easier for us to
      // import bundle output files (e.g. `import server from './build/server';`)
      index: removeNil([
        // We are using polyfill.io instead of the very heavy babel-polyfill.
        // Therefore we need to add the regenerator-runtime as polyfill.io
        // doesn't support this.
        ifClient('regenerator-runtime/runtime'),
        // Extends hot reloading with the ability to hot path React Components.
        // This should always be at the top of your entries list. Only put
        // polyfills above it.
        ifDevClient('react-hot-loader/patch'),
        // Required to support hot reloading of our client.
        ifDevClient(
          () =>
            `webpack-hot-middleware/client?reload=true&path=http://${config(
              'host',
            )}:${config('clientDevServerPort')}/__webpack_hmr`,
        ),

        // The source entry file for the bundle.
        path.resolve(appRootDir.get(), bundleConfig.srcEntryFile),
      ]),
    },

    // Bundle output configuration.
    output: {
      // The dir in which our bundle should be output.
      path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
      // The filename format for our bundle's entries.
      filename: ifProdClient(
        // For our production client bundles we include a hash in the filename.
        // That way we won't hit any browser caching issues when our bundle
        // output changes.
        // Note: as we are using the WebpackMd5Hash plugin, the hashes will
        // only change when the file contents change. This means we can
        // set very aggressive caching strategies on our bundle output.
        '[name]-[chunkhash].js',
        // For any other bundle (typically a server/node) bundle we want a
        // determinable output name to allow for easier importing/execution
        // of the bundle by our scripts.
        '[name].js',
      ),
      // The name format for any additional chunks produced for the bundle.
      chunkFilename: '[name]-[chunkhash].js',
      // When targetting node we will output our bundle as a commonjs2 module.
      libraryTarget: ifNode('commonjs2', 'var'),
      // This is the web path under which our webpack bundled client should
      // be considered as being served from.
      publicPath: ifDev(
        // As we run a seperate development server for our client and server
        // bundles we need to use an absolute http path for the public path.
        `http://${config('host')}:${config('clientDevServerPort')}${config(
          'bundles.client.webPath',
        )}`,
        // Otherwise we expect our bundled client to be served from this path.
        bundleConfig.webPath,
      ),
    },

    target: isClient
      ? // Only our client bundle will target the web as a runtime.
        'web'
      : // Any other bundle must be targetting node as a runtime.
        'node',

    // Ensure that webpack polyfills the following node features for use
    // within any bundles that are targetting node as a runtime. This will be
    // ignored otherwise.
    node: {
      __dirname: true,
      __filename: true,
    },

    // Source map settings.
    devtool: ifElse(
      // Include source maps for ANY node bundle so that we can support
      // nice stack traces for errors (the source maps get consumed by
      // the `node-source-map-support` module to allow for this).
      isNode ||
        // Always include source maps for any development build.
        isDev ||
        // Allow for the following flag to force source maps even for production
        // builds.
        config('includeSourceMapsForOptimisedClientBundle'),
    )(
      // Produces an external source map (lives next to bundle output files).
      'source-map',
      // Produces no source map.
      'hidden-source-map',
    ),

    // Performance budget feature.
    // This enables checking of the output bundle size, which will result in
    // warnings/errors if the bundle sizes are too large.
    // We only want this enabled for our production client.  Please
    // see the webpack docs on how you can configure this to your own needs:
    // https://webpack.js.org/configuration/performance/
    performance: ifProdClient(
      // Enable webpack's performance hints for production client builds.
      { hints: 'warning' },
      // Else we have to set a value of "false" if we don't want the feature.
      false,
    ),

    // Webpack 4 automatically runs UglifyPlugin and other optimization processes.
    // It can be configured here:
    optimization: {
      minimizer: ifProdClient([
        new UglifyJsPlugin({
          uglifyOptions: {
            ecma: 8,
            compress: {
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
            },
            mangle: {
              safari10: true,
            },
            output: {
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: config('includeSourceMapsForOptimisedClientBundle'),
        }),
      ]),
    },

    resolve: {
      // These extensions are tried when resolving a file.
      extensions: config('bundleSrcTypes').map(ext => `.${ext}`),

      // This is required for the modernizr-loader
      // @see https://github.com/peerigon/modernizr-loader
      alias: {
        modernizr$: path.resolve(appRootDir.get(), './.modernizrrc.json'),
      },
    },

    // We don't want our node_modules to be bundled with any bundle that is
    // targetting the node environment, prefering them to be resolved via
    // native node module system. Therefore we use the `webpack-node-externals`
    // library to help us generate an externals configuration that will
    // ignore all the node_modules.
    externals: removeNil([
      ifNode(() =>
        nodeExternals(
          // Some of our node_modules may contain files that depend on our
          // webpack loaders, e.g. CSS or SASS.
          // For these cases please make sure that the file extensions are
          // registered within the following configuration setting.
          {
            whitelist: removeNil([
              // We always want the source-map-support included in
              // our node target bundles.
              'source-map-support/register',
            ])
              // And any items that have been whitelisted in the config need
              // to be included in the bundling process too.
              .concat(config('nodeExternalsFileTypeWhitelist') || []),
          },
        ),
      ),
    ]),

    plugins: removeNil([
      // This grants us source map support, which combined with our webpack
      // source maps will give us nice stack traces for our node executed
      // bundles.
      // We use the BannerPlugin to make sure all of our chunks will get the
      // source maps support installed.
      ifNode(
        () =>
          new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false,
          }),
      ),

      // These are process.env flags that you can use in your code in order to
      // have advanced control over what is included/excluded in your bundles.
      // For example you may only want certain parts of your code to be
      // included/ran under certain conditions.
      //
      // Any process.env.X values that are matched will be code substituted for
      // the associated values below.
      //
      // For example you may have the following in your code:
      //   if (process.env.BUILD_FLAG_IS_CLIENT === 'true') {
      //     console.log('Foo');
      //   }
      //
      // If the BUILD_FLAG_IS_CLIENT was assigned a value of `false` the above
      // code would be converted to the following by the webpack bundling
      // process:
      //   if ('false' === 'true') {
      //     console.log('Foo');
      //   }
      //
      // When your bundle is built using the UglifyJsPlugin unreachable code
      // blocks like in the example above will be removed from the bundle
      // final output. This is helpful for extreme cases where you want to
      // ensure that code is only included/executed on specific targets, or for
      // doing debugging.
      //
      // NOTE: We are stringifying the values to keep them in line with the
      // expected type of a typical process.env member (i.e. string).
      // @see https://github.com/ctrlplusb/react-universally/issues/395
      new webpack.EnvironmentPlugin({
        // It is really important to use NODE_ENV=production in order to use
        // optimised versions of some node_modules, such as React.
        NODE_ENV: isProd ? 'production' : 'development',
        // Is this the "client" bundle?
        BUILD_FLAG_IS_CLIENT: JSON.stringify(isClient),
        // Is this the "server" bundle?
        BUILD_FLAG_IS_SERVER: JSON.stringify(isServer),
        // Is this a node bundle?
        BUILD_FLAG_IS_NODE: JSON.stringify(isNode),
        // Is this a development build?
        BUILD_FLAG_IS_DEV: JSON.stringify(isDev),
      }),

      // Generates a JSON file containing a map of all the output files for
      // our webpack bundle.  A necessisty for our server rendering process
      // as we need to interogate these files in order to know what JS/CSS
      // we need to inject into our HTML. We only need to know the assets for
      // our client bundle.
      ifClient(
        () =>
          new AssetsPlugin({
            filename: config('bundleAssetsFileName'),
            path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
          }),
      ),

      // We don't want webpack errors to occur during development as it will
      // kill our dev servers.
      ifDev(() => new webpack.NoEmitOnErrorsPlugin()),

      // We need this plugin to enable hot reloading of our client.
      ifDevClient(
        () =>
          new webpack.HotModuleReplacementPlugin({
            multiStep: true,
          }),
      ),

      // For the production build of the client we need to extract the CSS into
      // CSS files.
      ifProdClient(
        () =>
          new ExtractTextPlugin({
            filename: '[name]-[contenthash].css',
            allChunks: true,
          }),
      ),

      // -----------------------------------------------------------------------
      // START: HAPPY PACK PLUGINS
      //
      // @see https://github.com/amireh/happypack/
      //
      // HappyPack allows us to use threads to execute our loaders. This means
      // that we can get parallel execution of our loaders, significantly
      // improving build and recompile times.
      //
      // This may not be an issue for you whilst your project is small, but
      // the compile times can be signficant when the project scales. A lengthy
      // compile time can significantly impare your development experience.
      // Therefore we employ HappyPack to do threaded execution of our
      // "heavy-weight" loaders.

      // HappyPack 'javascript' instance.
      happyPackPlugin({
        name: 'happypack-javascript',
        // We will use babel to do all our JS processing.
        loaders: [
          {
            path: 'babel-loader',
            // We will create a babel config and pass it through the plugin
            // defined in the project configuration, allowing additional
            // items to be added.
            query: config('plugins.babelConfig')(
              // Our "standard" babel config.
              {
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
                  ifClient(['env', { es2015: { modules: false } }]),
                  // For a node bundle we use the specific target against
                  // babel-preset-env so that only the unsupported features of
                  // our target node version gets transpiled.
                  ifNode(['env', { targets: { node: true } }]),
                ].filter(x => x != null),

                plugins: [
                  // Required to support react hot loader.
                  ifDevClient('react-hot-loader/babel'),
                  // This decorates our components with  __self prop to JSX elements,
                  // which React will use to generate some runtime warnings.
                  ifDev('transform-react-jsx-self'),
                  // Adding this will give us the path to our components in the
                  // react dev tools.
                  ifDev('transform-react-jsx-source'),
                  // Replaces the React.createElement function with one that is
                  // more optimized for production.
                  // NOTE: Symbol needs to be polyfilled. Ensure this feature
                  // is enabled in the polyfill.io configuration.
                  ifProd('transform-react-inline-elements'),
                  // Hoists element creation to the top level for subtrees that
                  // are fully static, which reduces call to React.createElement
                  // and the resulting allocations. More importantly, it tells
                  // React that the subtree hasn’t changed so React can completely
                  // skip it when reconciling.
                  ifProd('transform-react-constant-elements'),
                  // Add syntax dynamic import for direct webpack `import()` support
                  'syntax-dynamic-import',
                ].filter(x => x != null),
              },
              buildOptions,
            ),
          },
        ],
      }),

      // HappyPack 'css' instance for development client.
      ifDevClient(() =>
        happyPackPlugin({
          name: 'happypack-devclient-css',
          loaders: [
            'style-loader',
            {
              path: 'css-loader',
              // Include sourcemaps for dev experience++.
              query: { sourceMap: true },
            },
          ],
        }),
      ),

      // END: HAPPY PACK PLUGINS
      // -----------------------------------------------------------------------
    ]),
    module: {
      // Use strict export presence so that a missing export becomes a compile error.
      strictExportPresence: true,
      rules: [
        {
          // "oneOf" will traverse all imports with following loaders until one will
          // match the requirements. When no loader matches it will fallback to the
          // "file" loader at the end of the loader list.
          oneOf: removeNil([
            // JAVASCRIPT
            {
              test: /\.jsx?$/,
              // We will defer all our js processing to the happypack plugin
              // named "happypack-javascript".
              // See the respective plugin within the plugins section for full
              // details on what loader is being implemented.
              loader: 'happypack/loader?id=happypack-javascript',
              include: removeNil([
                ...bundleConfig.srcPaths.map(srcPath =>
                  path.resolve(appRootDir.get(), srcPath),
                ),
                ifProdClient(path.resolve(appRootDir.get(), 'src/html')),
              ]),
            },

            // CSS
            // This is bound to our server/client bundles as we only expect to be
            // serving the client bundle as a Single Page Application through the
            // server.
            ifElse(isClient || isServer)(
              mergeDeep(
                {
                  test: /\.css$/,
                },
                // For development clients we will defer all our css processing to the
                // happypack plugin named "happypack-devclient-css".
                // See the respective plugin within the plugins section for full
                // details on what loader is being implemented.
                ifDevClient({
                  loaders: ['happypack/loader?id=happypack-devclient-css'],
                }),
                // For a production client build we use the ExtractTextPlugin which
                // will extract our CSS into CSS files. We don't use happypack here
                // as there are some edge cases where it fails when used within
                // an ExtractTextPlugin instance.
                // Note: The ExtractTextPlugin needs to be registered within the
                // plugins section too.
                ifProdClient(() => ({
                  loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader'],
                  }),
                })),
                // When targetting the server we use the "/locals" version of the
                // css loader, as we don't need any css files for the server.
                ifNode({
                  loaders: ['css-loader/locals'],
                }),
              ),
            ),

            // MODERNIZR
            // This allows you to do feature detection.
            // @see https://modernizr.com/docs
            // @see https://github.com/peerigon/modernizr-loader
            ifClient({
              test: /\.modernizrrc.js$/,
              loader: 'modernizr-loader',
            }),

            // ASSETS (Images/Fonts/etc)
            // This is bound to our server/client bundles as we only expect to be
            // serving the client bundle as a Single Page Application through the
            // server.
            ifElse(isClient || isServer)(() => ({
              loader: 'file-loader',
              exclude: [/\.js$/, /\.html$/, /\.json$/],
              query: {
                // What is the web path that the client bundle will be served from?
                // The same value has to be used for both the client and the
                // server bundles in order to ensure that SSR paths match the
                // paths used on the client.
                publicPath: isDev
                  ? // When running in dev mode the client bundle runs on a
                    // seperate port so we need to put an absolute path here.
                    `http://${config('host')}:${config(
                      'clientDevServerPort',
                    )}${config('bundles.client.webPath')}`
                  : // Otherwise we just use the configured web path for the client.
                    config('bundles.client.webPath'),
                // We only emit files when building a web bundle, for the server
                // bundle we only care about the file loader being able to create
                // the correct asset URLs.
                emitFile: isClient,
              },
            })),

            // Do not add any loader after file loader (fallback loader)
            // Make sure to add the new loader(s) before the "file" loader.
          ]),
        },
      ],
    },
  };

  if (isProd && isClient) {
    webpackConfig = withServiceWorker(webpackConfig, bundleConfig);
  }

  // Apply the configuration middleware.
  return config('plugins.webpackConfig')(webpackConfig, buildOptions);
}
