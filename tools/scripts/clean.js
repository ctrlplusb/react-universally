// This script removes any exisitng build output.

const pathResolve = require('path').resolve;
const appRootPath = require('app-root-dir').get();
const envVars = require('../config/envVars');
const { exec } = require('../utils.js');

const buildOutput = pathResolve(appRootPath, envVars.BUNDLE_OUTPUT_PATH);

const cmd = `$(npm bin)/rimraf ${buildOutput}`;

exec(cmd);
