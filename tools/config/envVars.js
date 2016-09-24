/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const appRoot = require('app-root-path');

const appRootPath = appRoot.toString();

// This is to support deployment to the "now" host.  See the README for more info.
const envFile = process.env.NOW
  ? './.envnow'
  : './.env';

// @see https://github.com/motdotla/dotenv
const envVars = dotenv.parse(
  fs.readFileSync(path.resolve(appRootPath, envFile), 'utf8')
);

module.exports = envVars;
