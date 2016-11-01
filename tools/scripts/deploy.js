// This script takes our environment variables and converts it into a format
// the "now" cli command will understand, and then it runs the "now" command
// in order to deploy our application.
// @see https://zeit.co/now

const envVars = require('../config/envVars');
const { exec } = require('../utils.js');

const cmdEnvVars = Object.keys(envVars)
  .map(key => `-e ${key}=${envVars[key]}`)
  .join(' ');

const cmd = `now -f ${cmdEnvVars}`;

exec(cmd);
