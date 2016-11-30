const HappyPack = require('happypack');
const notifier = require('node-notifier');
const colors = require('colors');
const execSync = require('child_process').execSync;
const appRootPath = require('app-root-dir').get();
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Generates a HappyPack plugin.
// @see https://github.com/amireh/happypack/
function happyPackPlugin({ name, loaders }) {
  // TODO: Try out the thread pool again since we upgraded to v3
  return new HappyPack({
    id: name,
    verbose: false,
    threads: 4,
    loaders,
  });
}

// :: [Any] -> [Any]
function removeEmpty(x) {
  return x.filter(y => !!y);
}

// :: bool -> (Any, Any) -> Any
function ifElse(condition) {
  return (then, or) => (condition ? then : or);
}

// :: ...Object -> Object
function merge() {
  const funcArgs = Array.prototype.slice.call(arguments); // eslint-disable-line prefer-rest-params

  return Object.assign.apply(
    null,
    removeEmpty([{}].concat(funcArgs))
  );
}

function createNotification(options = {}) {
  const title = options.title
    ? `${options.title.toUpperCase()}`
    : undefined;

  notifier.notify({
    title,
    message: options.message,
    open: options.open,
  });

  const level = options.level || 'info';
  const msg = `==> ${title} -> ${options.message}`;

  switch (level) {
    case 'warn': console.log(colors.red(msg)); break;
    case 'error': console.log(colors.bgRed.white(msg)); break;
    case 'info':
    default: console.log(colors.green(msg));
  }
}

function exec(command) {
  execSync(command, { stdio: 'inherit', cwd: appRootPath });
}

// :: string -> string
function getFilename(filePath) {
  return path.relative(path.dirname(filePath), filePath);
}

function ensureNotInClientBundle() {
  if (process.env.IS_CLIENT) {
    throw new Error(
      'You are importing the application configuration into the client bundle! This is super dangerous as you will essentially be exposing all your internals/logins/etc to the world.  If you need some configuration that will be consumed by the client bundle then add it to the clientSafe configuration file.'
    );
  }
}

// This exists so that we can support the recieving of environment variables
// from multiple sources. i.e.
//  - standard environment variables
//  - a '.env' file, supported by  https://github.com/motdotla/dotenv
//
//  If a .env file exists, the contents of it will read and then it will be
//  merged over the standard environment variables object, otherwise the
//  standard environment variables object (process.env) will be used.
//
//  This gives us a nice degree of flexibility in deciding where we would
//  like our environment variables to be loaded from, which can be especially
//  useful for environment variables that we consider sensitive.
function getEnvVars() {
  const envFile = path.resolve(appRootPath, './.env');

  return fs.existsSync(envFile)
    // We have a .env file, which we need to merge with the standard vars.
    ? Object.assign(
      {},
      // Merge the standard "process.env" environment variables object.
      process.env,
      // With the items from our ".env" file
      dotenv.parse(fs.readFileSync(envFile, 'utf8'))
    )
    // No .env file, so we will just use standard vars.
    : process.env;
}

module.exports = {
  removeEmpty,
  ifElse,
  merge,
  happyPackPlugin,
  createNotification,
  exec,
  getFilename,
  ensureNotInClientBundle,
  getEnvVars,
};
