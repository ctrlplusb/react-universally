// This script creates a webpack stats file on our production build of the
// client bundle and then launches the webpack-bundle-analyzer tool allowing
// you to easily see what is being included within your bundle.  Really helpful
// in those parses at trimming your bundle sizes down.
// @see https://github.com/th0r/webpack-bundle-analyzer

const { exec } = require('../utils.js');
const config = require('../config');

const cmd = `$(npm bin)/webpack --config ./tools/webpack/client.config.js --json > ${config.paths.bundleAnalyze} && webpack-bundle-analyzer ${config.paths.bundleAnalyze} ${config.paths.clientBundle}`;

exec(cmd);
