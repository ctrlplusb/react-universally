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
  const title = `${subject.toUpperCase()} DEVSERVER`

  console.log(`==> ${title} -> ${msg}`)

  notifier.notify({
    title: title,
    message: msg
  })
}

/**
 * -----------------------------------------------------------------------------
 * Server Bundle Server
 */
let serverListener = null
let lastConnectionKey = 0
const connectionMap = {}
const serverBundleCompiler = webpack(serverBundleConfig)
const serverBundlePath = path.resolve(
  serverBundleConfig.output.path, `${Object.keys(serverBundleConfig.entry)[0]}.js`
)

serverBundleCompiler.plugin('done', (stats) => {
  if (stats.hasErrors()) {
    createNotification('server', '😵  Build failed, check console for error')
    console.log(stats.toString())
    return
  }

  createNotification('server', '✅  Bundle built')

  // Make sure our newly built server and client bundles aren't in the module cache.
  Object.keys(require.cache).forEach(modulePath => {
    if (~modulePath.indexOf(serverBundleConfig.output.path)) {
      delete require.cache[modulePath]
    }
  })

  // We wrap the require and execution of our server bundle just in case it
  // contains invalid code that throws an exception.  Rather than taking down
  // the devServer this gives us the opportunity to fix the error and have
  // the server bundle start again automatically.
  try {
    // The server bundle  will automatically start the web server just by
    // requiring it.
    serverListener = require(serverBundlePath).default

    // Track all connections to our server so that we can close them when needed.
    serverListener.on('connection', connection => {
      // Generate a new key to represent the connection
      const connectionKey = ++lastConnectionKey
      // Add the connection to our map.
      connectionMap[connectionKey] = connection
      // Remove the connection from our map when it closes.
      connection.on('close', () => {
        delete connectionMap[connectionKey]
      })
    })

    createNotification('server', '✅  Running')
  } catch (err) {
    createNotification('server', '😵  Bundle invalid, check console for error')
    console.log(err)
  }
})

function serverListenerDispose (callback) {
  // First we destroy any connections.
  Object.keys(connectionMap).forEach((connectionKey) => {
    connectionMap[connectionKey].destroy()
  })

  // Then we close the server.
  if (serverListener) {
    serverListener.close(() => {
      if (callback) callback()
    })
  } else {
    callback()
  }
}

function compileServerBundle () {
  // Shut down any existing running server if necessary before starting the
  // compile, else just compile.
  if (serverListener) {
    serverListenerDispose(() => serverBundleCompiler.run(() => undefined))
  } else {
    serverBundleCompiler.run(() => undefined)
  }
}

// Now we will configure `chokidar` to watch our server specific source folder.
// Any changes will cause a rebuild of the server bundle.
const watcher = chokidar.watch([ path.resolve(__dirname, './src/server') ])
watcher.on('ready', () => {
  watcher
    .on('add', compileServerBundle)
    .on('addDir', compileServerBundle)
    .on('change', compileServerBundle)
    .on('unlink', compileServerBundle)
    .on('unlinkDir', compileServerBundle)
})

/**
 * -----------------------------------------------------------------------------
 * Client Bundle Server
 */
const clientBundleCompiler = webpack(clientBundleConfig)
clientBundleCompiler.plugin('done', (stats) => {
  if (stats.hasErrors()) {
    createNotification('client', '😵  Build failed, check console for error')
    console.log(stats.toString())
  } else {
    createNotification('client', '✅  Built')

    // We will also build the server bundle any time the client bundle has
    // been built.  We do this as the server bundle depends on the client bundle,
    // so if the client switched from an invalid to a valid state we want our
    // server bundle to restart too.
    compileServerBundle()
  }
})
const clientBundleServer = express()
const webpackDevMiddleware = createWebpackMiddleware(clientBundleCompiler, {
  quiet: true,
  noInfo: true,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  // The path at which the client bundles are served from.  Note: in this
  // case as we are running a seperate dev server the public path should
  // be absolute, i.e. including the "http://..."
  publicPath: clientBundleConfig.output.publicPath
})
clientBundleServer.use(webpackDevMiddleware)
clientBundleServer.use(createWebpackHotMiddleware(clientBundleCompiler))
const clientListener = clientBundleServer.listen(process.env.CLIENT_DEVSERVER_PORT)

/**
 * -----------------------------------------------------------------------------
 * Disposal
 */
function gracefulShutdown () {
  // Shut down any existing running servers before quiting.

  if (serverListener && clientListener) {
    serverListenerDispose(() => {
      clientListener.close(() => process.exit())
    })
  } else {
    if (serverListener) {
      serverListenerDispose(() => process.exit())
    }

    if (clientListener) {
      clientListener.close(() => process.exit())
    }
  }
}

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown)

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown)
