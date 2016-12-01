/* @flow */

import path from 'path';
import { sync as globSync } from 'glob';
import webpack from 'webpack';
import OfflinePlugin from 'offline-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import appRootDir from 'app-root-dir';
import WebpackMd5Hash from 'webpack-md5-hash';
import CodeSplitPlugin from 'code-split-component/webpack';
import { removeEmpty, ifElse, merge, happyPackPlugin, getFilename } from '../utils';
import config from '../config';

type BuildOptions = {
  target: 'server'|'client'|'tools',
  mode?: 'development'|'production',
};

export default function webpackConfigFactory(options: BuildOptions) {
  const { target, mode = 'production' } = options;
  console.log(`==> Creating webpack config for "${target}" in "${mode}" mode`);

  const appRootPath = appRootDir.get();

  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isClient = target === 'client';
  const isServer = target === 'server';

  // Preconfigure some ifElse helper instnaces. See the util docs for more
  // information on how this util works.
  const ifDev = ifElse(isDev);
  const ifClient = ifElse(isClient);
  const ifServer = ifElse(isServer);
  const ifDevClient = ifElse(isDev && isClient);
  const ifProdClient = ifElse(isProd && isClient);

  return {
    // We need to state that we are targetting "node" for our server bundle.
    target: ifServer('node', 'web'),
    // We have to set this to be able to use these items when executing a
    // server bundle.  Otherwise strangeness happens, like __dirname resolving
    // to '/'.  There is no effect on our client bundle.
    node: {
      __dirname: true,
      __filename: true,
    },
    // Anything listed in externals will not be included in our bundle.
    externals: removeEmpty([
      // We don't want our node_modules to be bundled with our server package,
      // prefering them to be resolved via native node module system.  Therefore
      // we use the `webpack-node-externals` library to help us generate an
      // externals config that will ignore all node_modules.
      ifServer(nodeExternals({
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
    devtool: ifElse(isServer || isDev)(
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
      'hidden-source-map',
    ),
    // Define our entry chunks for our bundle.
    entry: {
      index: removeEmpty([
        ifDevClient('react-hot-loader/patch'),
        ifDevClient(`webpack-hot-middleware/client?reload=true&path=http://${config.server.host}:${config.development.clientDevServerPort}/__webpack_hmr`),
        // We are using polyfill.io instead of the very heavy babel-polyfill.
        // Therefore we need to add the regenerator-runtime as the babel-polyfill
        // included this, which polyfill.io doesn't include.
        ifClient('regenerator-runtime/runtime'),
        isServer ? config.paths.serverSrc : config.paths.clientSrc,
      ]),
    },
    output: {
      // The dir in which our bundle should be output.
      path: isServer
        ? config.paths.serverBundle
        : config.paths.clientBundle,
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
        '[name].js',
      ),
      chunkFilename: '[name]-[chunkhash].js',
      // This is the web path under which our webpack bundled output should
      // be considered as being served from.
      publicPath: ifDev(
        // As we run a seperate server for our client and server bundles we
        // need to use an absolute http path for our assets public path.
        `http://${config.server.host}:${config.development.clientDevServerPort}${config.client.webRoot}`,
        // Otherwise we expect our bundled output to be served from this path.
        config.client.webRoot,
      ),
      // When in server mode we will output our bundle as a commonjs2 module.
      libraryTarget: ifServer('commonjs2', 'var'),
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
      // Required support for code-split-component, which provides us with our
      // code splitting functionality.
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
      new webpack.DefinePlugin({
        // Adding the NODE_ENV key is especially important as React relies
        // on it to optimize production builds.
        'process.env.NODE_ENV': JSON.stringify(mode),
        // Is this bundle a client bundle?
        'process.env.IS_CLIENT': JSON.stringify(isClient),
        // Is this bundle a server bundle?
        'process.env.IS_SERVER': JSON.stringify(isServer),
      }),

      // Generates a JSON file containing a map of all the output files for
      // our webpack bundle.  A necessisty for our server rendering process
      // as we need to interogate these files in order to know what JS/CSS
      // we need to inject into our HTML. We only need to know the assets for
      // our client bundle.
      ifClient(
        new AssetsPlugin({
          filename: config.client.assetsFilename,
          path: config.paths.clientBundle,
        }),
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
        }),
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
        }),
      ),

      ifProdClient(
        // This is a production client so we will extract our CSS into
        // CSS files.
        new ExtractTextPlugin({ filename: '[name]-[chunkhash].css', allChunks: true }),
      ),

      // Offline Plugin.
      //
      // @see https://github.com/NekR/offline-plugin
      //
      // This plugin generates a service worker script which as configured below
      // will precache all our generated client bundle assets as well as our
      // static "public" folder assets.
      //
      // This gives us aggressive caching on these assets for an improved
      // user experience.
      //
      // Any time our static files or generated bundle files change the user's
      // cache will be updated.
      ifProdClient(
        new OfflinePlugin({
          // Setting this value lets the plugin know where our generated client
          // assets will be served from.
          // e.g. /client/
          publicPath: config.client.webRoot,
          // When using the publicPath we need to disable the "relativePaths"
          // feature of this plugin.
          relativePaths: false,
          // Our offline support will be done via a service worker.
          // Read more on them here:
          // http://bit.ly/2f8q7Td
          ServiceWorker: {
            output: `${config.serviceWorker.name}.js`,
            events: true,
            // By default the service worker will be ouput and served from the
            // publicPath setting above in the root config of the OfflinePlugin.
            // This means that it would be served from /client/sw.js
            // We do not want this! Service workers have to be served from the
            // root of our application in order for them to work correctly.
            // Therefore we override the publicPath here. The sw.js will still
            // live in at the /build/client/sw.js output location therefore in
            // our server configuration we need to make sure that any requests
            // to /sw.js will serve the /build/client/sw.js file.
            publicPath: `/${config.serviceWorker.name}.js`,
            // When a user has no internet connectivity and a path is not available
            // in our service worker cache then the following file will be
            // served to them.  Go and make it pretty. :)
            navigateFallbackURL: config.serviceWorker.navigateFallbackURL,
          },
          // We aren't going to use AppCache and will instead only rely on
          // a Service Worker.
          AppCache: false,
          // NOTE: This will include ALL of our public folder assets.  We do
          // a glob pull of them and then map them to /foo paths as all the
          // public folder assets get served off the root of our application.
          // You may or may not want to be including these assets.  Feel free
          // to remove this or instead include only a very specific set of
          // assets.
          externals: globSync(`${config.paths.publicAssets}/**/*`)
            .map(publicFile => `/${getFilename(publicFile)}`),
        }),
      ),

      // NOTE: HappyPack plugins coming up next.
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
        loaders: [{
          path: 'babel-loader',
          query: {
            presets: removeEmpty([
              // JSX
              'react',
              // For our client bundles we transpile all the latest ratified
              // ES201X code into ES5, safe for browsers.  We exclude module
              // transilation as webpack takes care of this for us, doing
              // tree shaking in the process.
              ifClient(['latest', { es2015: { modules: false } }]),
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
              ifServer(['env', { targets: { node: true }, modules: false }]),
            ]),
            plugins: removeEmpty([
              ifDevClient('react-hot-loader/babel'),
              // We are adding the experimental "object rest spread" syntax as
              // it is super useful.  There is a caviat with the plugin that
              // requires us to include the destructuring plugin too.
              'transform-object-rest-spread',
              'transform-es2015-destructuring',
              // The class properties plugin is really useful for react components.
              'transform-class-properties',
              // This decorates our components with  __self prop to JSX elements,
              // which React will use to generate some runtime warnings.
              ifDev('transform-react-jsx-self'),
              // Adding this will give us the path to our components in the
              // react dev tools.
              ifDev('transform-react-jsx-source'),
              // The following plugin supports the code-split-component
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
                  // For our server bundle we will set the role as being 'server'
                  // which will ensure that our code split components can be
                  // resolved synchronously, being much more helpful for
                  // pre-rendering.
                  role: isServer ? 'server' : 'client',
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
          include: [
            path.resolve(appRootPath, './src'),
            path.resolve(appRootPath, './tools'),
          ],
        },

        // CSS
        // At the moment this is configured to do some basic css file processing,
        // combining any CSS files into a single file for production output.
        merge(
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
          ifProdClient({
            loader: ExtractTextPlugin.extract({
              fallbackLoader: 'style-loader',
              loader: ['css-loader'],
            }),
          }),
          // When targetting the server we use the "/locals" version of the
          // css loader, as we don't need any css files for the server.
          ifServer({
            loaders: ['css-loader/locals'],
          }),
        ),

        // JSON
        {
          test: /\.json$/,
          loader: 'json-loader',
        },

        // Images and Fonts
        {
          test: /\.(jpg|jpeg|png|gif|ico|eot|svg|ttf|woff|woff2|otf)$/,
          loader: 'file-loader',
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
