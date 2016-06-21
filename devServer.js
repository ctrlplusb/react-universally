const path = require('path')
const notifier = require('node-notifier')
const chokidar = require('chokidar')
const webpack = require('webpack')
const express = require('express')
const createWebpackMiddleware = require('webpack-dev-middleware')
const createWebpackHotMiddleware = require('webpack-hot-middleware')
const clientBundleConfig = require('./webpack.client.config')({ mode: 'development' })
const serverBundleConfig = require('./webpack.server.config')({ mode: 'development' })

function createNotification (subject, msg) {
  console.log(`==> 🔥  ${subject}: ${msg}`)

  notifier.notify({
    title: `🔥 ${subject} 🔥`,
    message: msg
  })
}

/**
 * Server bundle dev server starter.
 */
function startServerBundle () {
  let serverBundleListener = null
  let lastConnectionKey = 0
  const connectionMap = {}

  const serverBundleCompiler = webpack(serverBundleConfig)
  const serverBundlePath = path.resolve(
    serverBundleConfig.output.path, './main.js'
  )

  serverBundleCompiler.plugin('done', (stats) => {
    if (stats.hasErrors()) {
      console.log('==> 😵  Server webpack build failed')
      console.log(stats.toString())
      return
    }

    createNotification('server', 'Bundle has been built')

    // Make sure our newly built server and client bundles aren't in the module cache.
    Object.keys(require.cache).forEach(modulePath => {
      if (~modulePath.indexOf(serverBundleConfig.output.path)) {
        delete require.cache[modulePath]
      }
    })

    // The server bundle  will automatically start the web server just by
    // requiring it.
    serverBundleListener = require(serverBundlePath).default

    // Track all connections to our server so that we can close them when needed.
    serverBundleListener.on('connection', connection => {
      // Generate a new key to represent the connection
      const connectionKey = ++lastConnectionKey
      // Add the connection to our map.
      connectionMap[connectionKey] = connection
      // Remove the connection from our map when it closes.
      connection.on('close', () => {
        delete connectionMap[connectionKey]
      })
    })

    createNotification('server', 'Web server has been started')
  })

  function compileServerBundle () {
    // Shut down any existing running server if necessary before starting the
    // compile, else just compile.
    if (serverBundleListener) {
      // First we destroy any connections.
      Object.keys(connectionMap).forEach((connectionKey) => {
        connectionMap[connectionKey].destroy()
      })

      // Then we close the server.
      serverBundleListener.close((err) => {
        if (err) {
          throw err
        }
        serverBundleCompiler.run(() => undefined)
      })
    } else {
      serverBundleCompiler.run(() => undefined)
    }
  }

  // Now we will configure `chokidar` to watch our source folders for the server
  // bundle and then respond by recompiling the server bundle.
  // Make sure that you include ALL folders that could be included in a
  // server bundle.
  const watcher = chokidar.watch([
    path.resolve(__dirname, './src/server'),
    path.resolve(__dirname, './src/shared')
  ])

  watcher.on('ready', () => {
    watcher
      .on('add', compileServerBundle)
      .on('addDir', compileServerBundle)
      .on('change', compileServerBundle)
      .on('unlink', compileServerBundle)
      .on('unlinkDir', compileServerBundle)
  })

  // Kick off the first compilation of our server bundle.
  compileServerBundle()
}

/**
 * Client bundle dev server starter.
 */
function startClientBundle () {
  return new Promise((resolve, reject) => {
    const clientBundleCompiler = webpack(clientBundleConfig)

    // let firstBuildComplete = false
    clientBundleCompiler.plugin('done', () => {
      createNotification('client', 'Bundle has been built')
    })

    const clientBundleServer = express()
    const webpackDevMiddleware = createWebpackMiddleware(clientBundleCompiler, {
      quiet: true,
      noInfo: true,
      // The path at which the client bundles are served from.  Note: in this
      // case as we are running a seperate dev server the public path should
      // be absolute, i.e. including the "http://..."
      publicPath: clientBundleConfig.output.publicPath
    })
    clientBundleServer.use(webpackDevMiddleware)
    clientBundleServer.use(createWebpackHotMiddleware(clientBundleCompiler))
    clientBundleServer.listen(process.env.CLIENT_DEVSERVER_PORT)

    // We need to wait until the first bundle is built by our dev middleware
    // before we resolve the promise, which will then cause the server bundle
    // to start, as the server relies on the assets.json created by our client
    // bundle.
    let firstBuildComplete = false
    webpackDevMiddleware.waitUntilValid(() => {
      if (!firstBuildComplete) {
        firstBuildComplete = true
        resolve()
      }
    })
  })
}

startClientBundle()
  .then(startServerBundle)
