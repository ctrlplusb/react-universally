/* @flow */

// Environment project configuration
//
// This represents the configuration settings that typically change between
// each hosting environment.  You can pass the settings via host environment
// variables (e.g. `SERVER_PORT=1234 npm run start`) or by creating a `./env`
// file (supported by the `dotenv` library).

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import appRootDir from 'app-root-dir';

if (fs.existsSync(path.resolve(appRootDir.get(), './.env'))) {
  // This exists so that we can support the recieving of environment variables
  // from multiple sources. i.e.
  //  - standard environment variables
  //  and/or
  //  - a '.env' file, supported by  https://github.com/motdotla/dotenv
  //
  //  If a .env file exists, the contents of it will read and the contained
  //  environment variables will be registered.
  //
  //  This gives us a nice degree of flexibility in deciding where we would
  //  like our environment variables to be loaded from.
  //
  //  It is recommended that you keep the .env file ignored from source control,
  //  as it should always be host/environment specific.  This allows you to
  //  create your own .env file for your local development.
  dotenv.config();
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
