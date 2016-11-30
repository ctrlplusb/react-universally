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

const fs = require('fs');
const pathResolve = require('path').resolve;
const dotenv = require('dotenv');
const appRootPath = require('app-root-dir').get();
const envFile = pathResolve(appRootPath, './.env');

const envVars = fs.existsSync(envFile)
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

module.exports = envVars;
