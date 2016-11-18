const path = require('path');
const globSync = require('glob').sync;
const webpack = require('webpack');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const appRootPath = require('app-root-dir').get();
const WebpackMd5Hash = require('webpack-md5-hash');
const { removeEmpty, ifElse, merge, happyPackPlugin } = require('../utils');
const envVars = require('../config/envVars');
const appName = require('../../package.json').name;
const CodeSplitPlugin = require('code-split-component/webpack');

function webpackConfigFactory({ target, mode }, { json }) {
  if (!target || ['client', 'server', 'universalMiddleware'].findIndex(valid => target === valid) === -1) {
    throw new Error(
      'You must provide a "target" (client|server|universalMiddleware) to the webpackConfigFactory.'
    );
  }

  if (!mode || ['development', 'production'].findIndex(valid => mode === valid) === -1) {
    throw new Error(
      'You must provide a "mode" (development|production) to the webpackConfigFactory.'
    );
  }

  if (!json) {
    // Our bundle is outputing json for bundle analysis, therefore we don't
    // want to do this console output as it will interfere with the json output.
    //
    // You can run a bundle analysis by executing the following:
    //
    // $(npm bin)/webpack \
    //   --env.mode production \
    //   --config webpack.client.config.js \
    //   --json \
    //   --profile \
    //   > build/client/analysis.json
    //
    // And then upload the build/client/analysis.json to http://webpack.github.io/analyse/
    // This allows you to analyse your webpack bundle to make sure it is
    // optimal.
    console.log(`==> Creating webpack config for "${target}" in "${mode}" mode`);
  }

  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isUniversalMiddleware = target === 'universalMiddleware';
  const isNodeTarget = isServer || isUniversalMiddleware;

  // These are handy little helpers that use the boolean flags above.
  // They allow you to wrap a value with an condition check. It the condition
  // is met the value you provided will be returned, otherwise it will
  // return null.
  //
  // For example, say our "isDev" flag had a value of `true`. Then when we used
  // our helpers below we would get the following results:
  //   ifDev('foo');  // => 'foo'
  //   ifProd('foo'); // => null
  //
  // It also allows for a secondary argument, which will be used instead of the
  // null when the condition is not met. For example:
  //   ifDev('foo', 'bar');  // => 'foo'
  //   ifProd('foo', 'bar'); // => 'bar'
  //
  // This is really handy for doing inline value resolution within or webpack
  // configuration.  Then we simply use one of our utility functions (e.g.
  // removeEmpty) to remove all the nulls.
  const ifNodeTarget = ifElse(isNodeTarget);
  const ifDev = ifElse(isDev);
  const ifProd = ifElse(isProd); // eslint-disable-line no-unused-vars
  const ifClient = ifElse(isClient);
  const ifServer = ifElse(isServer);
  const ifDevServer = ifElse(isDev && isServer);
  const ifDevClient = ifElse(isDev && isClient);
  const ifProdClient = ifElse(isProd && isClient);

  return {
    // We need to state that we are targetting "node" for our server bundle.
    target: ifNodeTarget('node', 'web'),
    // We have to set this to be able to use these items when executing a
    // server bundle.  Otherwise strangeness happens, like __dirname resolving
    // to '/'.  There is no effect on our client bundle.
    node: {
      __dirname: true,
      __filename: true,
    },
    // Anything listed in externals will not be included in our bundle.
    externals: removeEmpty([
      // Don't allow the server to bundle the universal middleware bundle. We
      // want the server to natively require it from the build dir.
      ifServer(/\.\.[/\\]universalMiddleware/),
      ifDevServer(/development[/\\]universalDevMiddleware/),

      // We don't want our node_modules to be bundled with our server package,
      // prefering them to be resolved via native node module system.  Therefore
      // we use the `webpack-node-externals` library to help us generate an
      // externals config that will ignore all node_modules.
      ifNodeTarget(nodeExternals({
        // NOTE: !!!
        // However the node_modules may contain files that will rely on our
        // webpack loaders in order to be used/resolved, for example CSS or
        // SASS. For these cases please make sure that the file extensions
        // are added to the below list. We have added the most common formats.
        whitelist: [
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|sss|less)$/,
        ],
      })),
    ]),
    devtool: ifElse(isNodeTarget || isDev)(
      // We want to be able to get nice stack traces when running our server
      // bundle.  To fully support this we'll also need to configure the
      // `node-source-map-support` module to execute at the start of the server
      // bundle.  This module will allow the node to make use of the
      // source maps.
      // We also want to be able to link to the source in chrome dev tools
      // whilst we are in development mode. :)
      'source-map',
      // When in production client mode we don't want any source maps to
      // decrease our payload sizes.
      // This form has almost no cost.
      'hidden-source-map'
    ),
    // Define our entry chunks for our bundle.
    entry: merge(
      {
        index: removeEmpty([
          ifDevClient('react-hot-loader/patch'),
          ifDevClient(`webpack-hot-middleware/client?reload=true&path=http://localhost:${envVars.CLIENT_DEVSERVER_PORT}/__webpack_hmr`),
          // We are using polyfill.io instead of the very heavy babel-polyfill.
          // Therefore we need to add the regenerator-runtime as the babel-polyfill
          // included this, which polyfill.io doesn't include.
          ifClient('regenerator-runtime/runtime'),
          path.resolve(appRootPath, `./src/${target}/index.js`),
        ]),
      }
    ),
    output: {
      // The dir in which our bundle should be output.
      path: path.resolve(appRootPath, envVars.BUNDLE_OUTPUT_PATH, `./${target}`),
      // The filename format for our bundle's entries.
      filename: ifProdClient(
        // We include a hash for client caching purposes.  Including a unique
        // has for every build will ensure browsers always fetch our newest
        // bundle.
        '[name]-[chunkhash].js',
        // We want a determinable file name when running our server bundles,
        // as we need to be able to target our server start file from our
        // npm scripts.  We don't care about caching on the server anyway.
        // We also want our client development builds to have a determinable
        // name for our hot reloading client bundle server.
        '[name].js'
      ),
      chunkFilename: '[name]-[chunkhash].js',
      // This is the web path under which our webpack bundled output should
      // be considered as being served from.
      publicPath: ifDev(
        // As we run a seperate server for our client and server bundles we
        // need to use an absolute http path for our assets public path.
        `http://localhost:${envVars.CLIENT_DEVSERVER_PORT}${envVars.CLIENT_BUNDLE_HTTP_PATH}`,
        // Otherwise we expect our bundled output to be served from this path.
        envVars.CLIENT_BUNDLE_HTTP_PATH
      ),
      // When in server mode we will output our bundle as a commonjs2 module.
      libraryTarget: ifNodeTarget('commonjs2', 'var'),
    },
    resolve: {
      // These extensions are tried when resolving a file.
      extensions: [
        '.js',
        '.jsx',
        '.json',
      ],
    },
    plugins: removeEmpty([
      new CodeSplitPlugin({
        // The code-split-component doesn't work nicely with hot module reloading,
        // which we use in our development builds, so we will disable it (which
        // ensures synchronously behaviour on the CodeSplit instances).
        disabled: isDev,
      }),

      // We use this so that our generated [chunkhash]'s are only different if
      // the content for our respective chunks have changed.  This optimises
      // our long term browser caching strategy for our client bundle, avoiding
      // cases where browsers end up having to download all the client chunks
      // even though 1 or 2 may have only changed.
      ifClient(new WebpackMd5Hash()),

      // The DefinePlugin is used by webpack to substitute any patterns that it
      // finds within the code with the respective value assigned below.
      //
      // For example you may have the following in your code:
      //   if (process.env.NODE_ENV === 'development') {
      //     console.log('Foo');
      //   }
      //
      // If we assign the NODE_ENV variable in the DefinePlugin below a value
      // of 'production' webpack will replace your code with the following:
      //   if ('production' === 'development') {
      //     console.log('Foo');
      //   }
      //
      // This is very useful as we are compiling/bundling our code and we would
      // like our environment variables to persist within the code.
      //
      // At the same time please be careful with what environment variables you
      // use in each respective bundle.  For example, don't accidentally
      // expose a database connection string within your client bundle src!
      new webpack.DefinePlugin(
        merge(
          {
            // NOTE: The NODE_ENV key is especially important for production
            // builds as React relies on process.env.NODE_ENV for optimizations.
            'process.env.NODE_ENV': JSON.stringify(mode),
            // Feel free to add any "dynamic" environment variables, to be
            // created by this webpack script.  Below I am adding a "IS_NODE"
            // environment variable which will allow our code to know if it's
            // being bundled for a node target.
            'process.env.IS_NODE': JSON.stringify(isNodeTarget),
          },
          // Now we will expose all of our environment variables to webpack
          // so that it can make all the subtitutions for us.
          // Note: ALL of these values will be given as string types, therefore
          // you may need to do operations like the following within your src:
          // const MY_NUMBER = parseInt(process.env.MY_NUMBER, 10);
          // const MY_BOOL = process.env.MY_BOOL === 'true';
          Object.keys(envVars).reduce((acc, cur) => {
            acc[`process.env.${cur}`] = JSON.stringify(envVars[cur]); // eslint-disable-line no-param-reassign
            return acc;
          }, {})
        )
      ),

      ifClient(
        // Generates a JSON file containing a map of all the output files for
        // our webpack bundle.  A necessisty for our server rendering process
        // as we need to interogate these files in order to know what JS/CSS
        // we need to inject into our HTML.
        new AssetsPlugin({
          filename: envVars.BUNDLE_ASSETS_FILENAME,
          path: path.resolve(appRootPath, envVars.BUNDLE_OUTPUT_PATH, `./${target}`),
        })
      ),

      // We don't want webpack errors to occur during development as it will
      // kill our dev servers.
      ifDev(new webpack.NoErrorsPlugin()),

      // We need this plugin to enable hot module reloading for our dev server.
      ifDevClient(new webpack.HotModuleReplacementPlugin()),

      // Adds options to all of our loaders.
      ifProdClient(
        new webpack.LoaderOptionsPlugin({
          // Indicates to our loaders that they should minify their output
          // if they have the capability to do so.
          minimize: true,
          // Indicates to our loaders that they should enter into debug mode
          // should they support it.
          debug: false,
        })
      ),

      // JS Minification.
      ifProdClient(
        new webpack.optimize.UglifyJsPlugin({
          // sourceMap: true,
          compress: {
            screw_ie8: true,
            warnings: false,
          },
          mangle: {
            screw_ie8: true,
          },
          output: {
            comments: false,
            screw_ie8: true,
          },
        })
      ),

      ifProdClient(
        // This is actually only useful when our deps are installed via npm2.
        // In npm2 its possible to get duplicates of dependencies bundled
        // given the nested module structure. npm3 is flat, so this doesn't
        // occur.
        new webpack.optimize.DedupePlugin()
      ),

      ifProdClient(
        // This is a production client so we will extract our CSS into
        // CSS files.
        new ExtractTextPlugin({ filename: '[name]-[chunkhash].css', allChunks: true })
      ),

      // Service Worker.
      // @see https://github.com/goldhand/sw-precache-webpack-plugin
      // This plugin generates a service worker script which as configured below
      // will precache all our generated client bundle assets as well as the
      // index page for our application.
      // This gives us aggressive caching as well as offline support.
      // Don't worry about cache invalidation. As we are using the Md5HashPlugin
      // for our assets, any time their contents change they will be given
      // unique file names, which will cause the service worker to fetch them.
      ifProdClient(
        new SWPrecacheWebpackPlugin(merge(
          {
            // Note: The default cache size is 2mb. This can be reconfigured:
            // maximumFileSizeToCacheInBytes: 2097152,
            cacheId: `${appName}-sw`,
            filepath: path.resolve(envVars.BUNDLE_OUTPUT_PATH, './serviceWorker/sw.js'),
            dynamicUrlToDependencies: (() => {
              const clientBundleAssets = globSync(
                path.resolve(appRootPath, envVars.BUNDLE_OUTPUT_PATH, './client/*.js')
              );
              return globSync(path.resolve(appRootPath, './public/*'))
                .reduce((acc, cur) => {
                  // We will precache our public asset, with it being invalidated
                  // any time our client bundle assets change.
                  acc[`/${path.basename(cur)}`] = clientBundleAssets; // eslint-disable-line no-param-reassign,max-len
                  return acc;
                },
                {
                  // Our index.html page will be precatched and it will be
                  // invalidated and refetched any time our client bundle
                  // assets change.
                  '/': clientBundleAssets,
                  // Lets cache the call to the polyfill.io service too.
                  'https://cdn.polyfill.io/v2/polyfill.min.js': clientBundleAssets,
                });
            })(),
          },
          ifElse(!!json)({
            // When outputing a json stat file we want to silence the output.
            verbose: false,
            logger: () => undefined,
          })
        ))
      ),

      // HappyPack plugins
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
        loaders: [{
          path: 'babel',
          query: {
            presets: [
              // JSX
              'react',
              // All the latest JS goodies, except for ES6 modules which
              // webpack has native support for and uses in the tree shaking
              // process.
              // TODO: When babel-preset-latest-minimal has stabilised use it
              // for our node targets so that only the missing features for
              // our respective node version will be transpiled.
              ['latest', { es2015: { modules: false } }],
            ],
            plugins: removeEmpty([
              ifDevClient('react-hot-loader/babel'),
              // We are adding the experimental "object rest spread" syntax as
              // it is super useful.  There is a caviat with the plugin that
              // requires us to include the destructuring plugin too.
              'transform-object-rest-spread',
              'transform-es2015-destructuring',
              // The class properties plugin is really useful for react components.
              'transform-class-properties',
              // This plugin transpiles the code-split-component component
              // instances, taking care of all the heavy boilerplate that we
              // would have had to do ourselves to get code splitting w/SSR
              // support working.
              // @see https://github.com/ctrlplusb/code-split-component
              [
                'code-split-component/babel',
                {
                  // The code-split-component doesn't work nicely with hot
                  // module reloading, which we use in our development builds,
                  // so we will disable it (which ensures synchronously
                  // behaviour on the CodeSplit instances).
                  disabled: isDev,
                  // When a node target (i.e. a server rendering bundle) then
                  // we will set the role as being server which will ensure that
                  // our code split components are resolved synchronously.
                  role: isNodeTarget ? 'server' : 'client',
                },
              ],
            ]),
          },
        }],
      }),

      // HappyPack 'css' instance for development client.
      ifDevClient(
        happyPackPlugin({
          name: 'happypack-devclient-css',
          // We will use a straight style & css loader along with source maps.
          // This combo gives us a better development experience.
          loaders: [
            'style-loader',
            { path: 'css-loader', query: { sourceMap: true } },
          ],
        })
      ),
    ]),
    module: {
      rules: removeEmpty([
        // Javascript
        {
          test: /\.jsx?$/,
          // We will defer all our js processing to the happypack plugin
          // named "happypack-javascript".
          // See the respective plugin within the plugins section for full
          // details on what loader is being implemented.
          loader: 'happypack/loader?id=happypack-javascript',
          include: [path.resolve(appRootPath, './src')],
        },

        // CSS
        merge(
          {
            test: /\.css$/,
          },
          // For a production client build we use the ExtractTextPlugin which
          // will extract our CSS into CSS files.
          // The plugin needs to be registered within the plugins section too.
          // Also, as we are using the ExtractTextPlugin we can't use happypack
          // for this case.
          ifProdClient({
            loader: ExtractTextPlugin.extract({
              fallbackLoader: 'style-loader',
              loader: 'css-loader',
            }),
          }),
          // When targetting the server we use the "/locals" version of the
          // css loader, as we don't need any css files for the server.
          ifNodeTarget({
            loaders: ['css-loader/locals'],
          }),
          // For development clients we will defer all our css processing to the
          // happypack plugin named "happypack-devclient-css".
          // See the respective plugin within the plugins section for full
          // details on what loader is being implemented.
          ifDevClient({
            loaders: ['happypack/loader?id=happypack-devclient-css'],
          })
        ),

        // JSON
        {
          test: /\.json$/,
          loader: 'json-loader',
        },

        // Images and Fonts
        {
          test: /\.(jpg|jpeg|png|gif|ico|eot|svg|ttf|woff|woff2|otf)$/,
          loader: 'url-loader',
          query: {
            // Any file with a byte smaller than this will be "inlined" via
            // a base64 representation.
            limit: 10000,
            // We only emit files when building a client bundle, for the server
            // bundles this will just make sure any file imports will not fall
            // over.
            emitFile: isClient,
          },
        },
      ]),
    },
  };
}

module.exports = webpackConfigFactory;
