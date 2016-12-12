/* @flow */

import { sync as globSync } from 'glob';
import path from 'path';
import appRootDir from 'app-root-dir';
// $FlowFixMe
import flowRemoveTypes from 'flow-remove-types';
import fs from 'fs';
import rimraf from 'rimraf';
import { exec } from '../utils';

function safeDelete(target, cb) {
  if (fs.existsSync(target)) {
    rimraf(target, (err) => {
      if (err) {
        console.log('Failed to delete:', target);
      }
      if (cb) {
        cb();
      }
    });
  }
}

const srcPaths = [
  path.resolve(appRootDir.get(), './src'),
  path.resolve(appRootDir.get(), './tools'),
  path.resolve(appRootDir.get(), './config'),
];
const flowTypesPaths = [
  path.resolve(appRootDir.get(), './src/shared/types'),
  path.resolve(appRootDir.get(), './tools/types.js'),
];
const flowConfigPath = path.resolve(appRootDir.get(), './.flowconfig');
const packageJsonPath = path.resolve(appRootDir.get(), './package.json');
const flowToolsPath = path.resolve(appRootDir.get(), './tools/flow');
const flowScriptPath = path.resolve(appRootDir.get(), './tools/scripts/flow.js');

// Strip the flow types from our src files.
srcPaths
  // Get all the files.
  .reduce((acc, cur) =>
    acc
      .concat(globSync(path.resolve(cur, './**/*.js')))
      .concat(globSync(path.resolve(cur, './**/*.jsx')))
  , [])
  // Remoe the types from each file.
  .forEach((file) => {
    console.log(`Removing types from "${file}`);
    const input = fs.readFileSync(file, 'utf8');
    const withoutFlow = flowRemoveTypes(input).toString();
    const cleanedUp = withoutFlow
      // Remove the empty flow tags.
      .replace(/\/\*\s+\*\/\n/g, '')
      // Remove any blank lines at top of file.
      .replace(/^\n+/, '')
      // Remove any multiple blank lines in files.
      .replace(/\n\n+/g, '\n\n');
    fs.writeFileSync(file, cleanedUp);
  });

Promise
  // Delete the types folders.
  .all(
    flowTypesPaths.map(typesPath => new Promise((resolve) => {
      safeDelete(typesPath, resolve);
    })),
  )
  // Then do an eslint fix parse on the src files.
  .then(() => {
    srcPaths.forEach((srcPath) => {
      exec(`eslint --fix ${srcPath}`);
    });
  });

// Remove the .flowconfig
safeDelete(flowConfigPath);

// Remove the flow tools
safeDelete(flowToolsPath);

// Remove the flow script
safeDelete(flowScriptPath);

// Remove all flow items from the package.json
fs.writeFileSync(
  packageJsonPath,
  fs.readFileSync(packageJsonPath, 'utf8')
    .replace(/\s+"flow:?.*\n/g, '\n')
    // Remove any multiple blank lines in files.
    .replace(/\n\n+/g, '\n')
    // Fix any hanging ',' chars
    .replace(/,+([\s\n]+)\}/g, '$1}'),
);
