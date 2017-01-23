/**
 * Helper for resolving environment specific configuration.
 *
 * TODO: Detailed documentation.
 */

import appRootDir from 'app-root-dir';
import colors from 'colors/safe';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import userHome from 'user-home';

import pkg from '../../package.json';

// PRIVATES

// :: (Boolean, () => Element) -> ?Any
const onlyIf = (a, b) => (a ? b() : null);

// :: (Boolean)
const removeEmpty = a => a.filter(x => x != null);

function registerEnvFile() {
  const CONF_ENV = process.env.CONF_ENV;
  const envFile = '.env';

  // This is the order in which we will try to resolve an environment configuration
  // file.
  const envFileResolutionOrder = removeEmpty([
    // Is there an environment config file at the app root for our target
    // environment name?
    // e.g. /projects/react-universally/.env.development
    onlyIf(CONF_ENV, () => path.resolve(appRootDir.get(), `${envFile}.${CONF_ENV}`)),
    // Is there an environment config file at the app root?
    // e.g. /projects/react-universally/.env
    path.resolve(appRootDir.get(), envFile),
    // Is there an environment config file in the executing user's home dir
    // that is targetting the specific environment?
    // e.g. /Users/ctrlplusb/.config/react-universally/.env.development
    onlyIf(CONF_ENV, () => path.resolve(userHome, '.config', pkg.name, `${envFile}.${CONF_ENV}`)),
    // Is there an environment config file in the executing user's home dir?
    // e.g. /Users/ctrlplusb/.config/react-universally/.env
    path.resolve(userHome, '.config', pkg.name, envFile),
  ]);

  // Find the first env file path match.
  const envFilePath = envFileResolutionOrder.find(filePath => fs.existsSync(filePath));

  // If we found an env file match the register it.
  if (envFilePath) {
    console.log( // eslint-disable-line no-console
      colors.bgBlue.white(`==> Registering environment variables from: ${envFilePath}`),
    );
    dotenv.config({ path: envFilePath });
  }
}

// Ensure that we first register any environment variables from an existing
// env file.
registerEnvFile();

// EXPORTED HELPERS

export function string(name, defaultVal) {
  return process.env[name] || defaultVal;
}

export function int(name, defaultVal) {
  return process.env[name]
    ? parseInt(process.env[name], 10)
    : defaultVal;
}

export function bool(name, defaultVal) {
  return process.env[name]
    ? process.env[name] === 'true' || process.env[name] === '1'
    : defaultVal;
}
