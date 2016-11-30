/* @flow */

// This script removes any exisitng build output.

const { exec } = require('../utils.js');
const config = require('../config');

const cmd = `$(npm bin)/rimraf ${config.paths.buildOutput}`;

exec(cmd);
