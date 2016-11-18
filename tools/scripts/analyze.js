// This script creates a webpack stats file on our production build of the
// client bundle and then launches the webpack-bundle-analyzer tool allowing
// you to easily see what is being included within your bundle.  Really helpful
// in those parses at trimming your bundle sizes down.
// @see https://github.com/th0r/webpack-bundle-analyzer

const pathResolve = require('path').resolve;
const appRootPath = require('app-root-dir').get();
const envVars = require('../config/envVars');
const { exec } = require('../utils.js');

const jsonPath = pathResolve(appRootPath, envVars.BUNDLE_OUTPUT_PATH, 'clientStats.json');
const clientBundlePath = pathResolve(appRootPath, envVars.BUNDLE_OUTPUT_PATH, 'client');

const cmd = `$(npm bin)/webpack --config ./tools/webpack/client.config.js --json > ${jsonPath} && webpack-bundle-analyzer ${jsonPath} ${clientBundlePath}`;

exec(cmd);
