/* @flow */

// Environment project configuration
//
// This represents the configuration settings that typically change between
// each hosting environment.  You can pass the settings via host environment
// variables (e.g. `SERVER_PORT=1234 npm run start`) or by creating an
// environment configuration file (supported by the `dotenv` library).
// @see https://github.com/motdotla/dotenv
//
// The environment configuration file is optional. We will check for the
// existence of an environemnt configuration file in a priority ordered manner
// across the file system.  Please see the envFileResolutionOrder variable
// below for details on this.
//
// This gives us a nice degree of flexibility in deciding where we would
// like our environment variables to be loaded from.

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import appRootDir from 'app-root-dir';
import userHome from 'user-home';
import colors from 'colors/safe';
import pkg from '../../package.json';
import staticConfig from './project';

function registerEnvFile() {
  const envName = process.env.NODE_ENV || 'development';
  const envFile = staticConfig.envFileName;

  // This is the order in which we will try to resolve an environment configuration
  // file.
  const envFileResolutionOrder = [
    // Is there an environment config file at the app root for our target
    // environment name?
    // e.g. /projects/react-universally/.env.development
    path.resolve(appRootDir.get(), `${envFile}.${envName}`),
    // Is there an environment config file at the app root?
    // e.g. /projects/react-universally/.env
    path.resolve(appRootDir.get(), envFile),
    // Is there an environment config file in the executing user's home dir
    // that is targetting the specific environment?
    // e.g. /Users/ctrlplusb/.config/react-universally/.env.development
    path.resolve(userHome, '.config', pkg.name, `${envFile}.${envName}`),
    // Is there an environment config file in the executing user's home dir?
    // e.g. /Users/ctrlplusb/.config/react-universally/.env
    path.resolve(userHome, '.config', pkg.name, envFile),
  ];

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

function getStringEnvVar(name : string, defaultVal : string) {
  return process.env[name] || defaultVal;
}

function getIntEnvVar(name : string, defaultVal : number) {
  return process.env[name]
    ? parseInt(process.env[name], 10)
    : defaultVal;
}

function getBoolVar(name : string, defaultVal : boolean) {
  return process.env[name]
    ? process.env[name] === 'true'
    : defaultVal;
}

// Ensure that we first register any environment variables from an existing
// env file.
registerEnvFile();

export default {
  // The host on which the server should run.
  host: getStringEnvVar('SERVER_HOST', 'localhost'),
  // The port on which the server should run.
  port: getIntEnvVar('SERVER_PORT', 1337),
  // Enable SSR rendering of the React application?
  // It can be useful to disable this in development in order to debug complex
  // issues with your React components.
  ssrEnabled: getBoolVar('SSR_ENABLED', true),
  // The port on which the client bundle development server should run.
  clientDevServerPort: getIntEnvVar('CLIENT_DEVSERVER_PORT', 7331),
};
