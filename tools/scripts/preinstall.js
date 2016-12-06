// Preinstall checks.

import appRootDir from 'app-root-dir';
import { resolve as pathResolve } from 'path';
import semver from 'semver';
import colors from 'colors/safe';

// Lifted from "create-react-app". Thanks @gaearon :)
function checkNodeVersion() {
  const packageJson = require(pathResolve(appRootDir.get(), 'package.json'));
  if (!packageJson.engines || !packageJson.engines.node) {
    return;
  }

  if (!semver.satisfies(process.version, packageJson.engines.node)) {
    console.error(
      colors.red(
        `You are currently running Node ${process.version} but ${packageJson.name} requires ${packageJson.engines.node}. Please use a supported version of Node.\n`,
      ),
    );
    process.exit(1);
  }
}

checkNodeVersion();
