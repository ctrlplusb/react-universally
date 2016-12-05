/* @flow */

import { sync as globSync } from 'glob';
import path from 'path';
import appRootDir from 'app-root-dir';
import flowRemoveTypes from 'flow-remove-types';
import fs from 'fs';
import rimraf from 'rimraf';
import { exec } from '../utils';

const appRootPath = appRootDir.get();

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
  path.resolve(appRootPath, './src'),
  path.resolve(appRootPath, './tools'),
  path.resolve(appRootPath, './config'),
];
const flowTypesPaths = [
  path.resolve(appRootPath, './src/shared/types'),
  path.resolve(appRootPath, './tools/types'),
];
const flowConfigPath = path.resolve(appRootPath, './.flowconfig');
const packageJsonPath = path.resolve(appRootPath, './package.json');
const flowToolsPath = path.resolve(appRootPath, './tools/flow');
const flowScriptPath = path.resolve(appRootPath, './tools/scripts/flow.js');

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
    const output =
      // Remove flow annotations
      flowRemoveTypes(input)
      // Remove the empty flow tags.
      .replace(/\/\*\s+\*\/\n/g, '')
      // Remove any blank lines at top of file.
      .replace(/^\n+/, '')
      // Remove any multiple blank lines in files.
      .replace(/\n\n\n/g, '\n\n');
    fs.writeFileSync(file, output);
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
