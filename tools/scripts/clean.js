/* @flow */

// This script removes any exisitng build output.

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import { exec } from '../utils';
import projConfig from '../../config/private/project';

const cmd = `$(npm bin)/rimraf ${pathResolve(appRootDir.get(), projConfig.buildOutputPath)}`;

exec(cmd);
