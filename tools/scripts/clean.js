// This script removes any exisitng build output.

const { exec } = require('../utils.js');
const projectConfig = require('../../config/project');

const cmd = `$(npm bin)/rimraf ${projectConfig.buildOutputPath}`;

exec(cmd);
