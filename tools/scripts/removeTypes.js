const globSync = require('glob').sync;
const path = require('path');
const appRootPath = require('app-root-dir').get();
const flowRemoveTypes = require('flow-remove-types');
const fs = require('fs');
const rimraf = require('rimraf');
const { exec } = require('../utils');

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

const srcPath = path.resolve(appRootPath, 'src');
const flowConfigPath = path.resolve(appRootPath, '.flowconfig');
const packageJsonPath = path.resolve(appRootPath, 'package.json');
const flowToolsPath = path.resolve(appRootPath, 'tools/flow');
const flowTypesPath = path.resolve(appRootPath, 'src/shared/universal/types');
const flowScriptPath = path.resolve(appRootPath, 'tools/scripts/flow.js');

const isJsFile = file => path.extname(file) === '.js';

// Strip the flow types from our src files.
globSync(`${path.resolve(appRootPath, 'src')}/**/*.js`)
  .filter(isJsFile)
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

// Delete the types folder in the src
safeDelete(
  flowTypesPath,
  // Then do an eslint fix parse on the src files.
  () => exec(`eslint --fix ${srcPath}`)
);

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
    .replace(/,+([\s\n]+)\}/g, '$1}')
);
