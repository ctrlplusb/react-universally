/* @flow */

// This script removes any exisitng build output.

import { exec } from '../utils';
import config from '../config';

const cmd = `$(npm bin)/rimraf ${config.paths.buildOutput}`;

exec(cmd);
