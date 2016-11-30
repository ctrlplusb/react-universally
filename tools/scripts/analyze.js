// This script creates a webpack stats file on our production build of the
// client bundle and then launches the webpack-bundle-analyzer tool allowing
// you to easily see what is being included within your bundle.  Really helpful
// in those parses at trimming your bundle sizes down.
// @see https://github.com/th0r/webpack-bundle-analyzer

const pathResolve = require('path').resolve;
const { exec } = require('../utils.js');
const projectConfig = require('../../config/project');

const jsonPath = pathResolve(projectConfig.buildOutputPath, 'client-analyze.json');

const cmd = `$(npm bin)/webpack --config ./tools/webpack/client.config.js --json > ${jsonPath} && webpack-bundle-analyzer ${jsonPath} ${projectConfig.client.outputPath}`;

exec(cmd);
