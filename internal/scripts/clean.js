// This script removes any exisitng build output.

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import { exec } from '../utils';
import getConfig from '../../config/getConfig';

const cmd = `$(npm bin)/rimraf ${pathResolve(appRootDir.get(), getConfig('buildOutputPath'))}`;

exec(cmd);
