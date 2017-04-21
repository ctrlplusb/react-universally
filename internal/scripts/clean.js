/**
 * This script removes any exisitng build output.
 */

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import rimraf from 'rimraf';
import config from '../../config';

function clean() {
  rimraf(pathResolve(appRootDir.get(), config('buildOutputPath')), () => {
    console.log(`Cleaned ${pathResolve(appRootDir.get(), config('buildOutputPath'))}`);
  });
}

clean();
