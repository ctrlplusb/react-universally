/* @flow */

// This script removes any exisitng build output.

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import { exec } from '../utils';
import staticConfig from '../../config/static';

const cmd = `$(npm bin)/rimraf ${pathResolve(appRootDir.get(), staticConfig.buildOutputPath)}`;

exec(cmd);
