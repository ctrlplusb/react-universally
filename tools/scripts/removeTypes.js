const globSync = require('glob').sync;
const path = require('path');
const appRootPath = require('app-root-path').toString();
const flowRemoveTypes = require('flow-remove-types');
const fs = require('fs');
const rimraf = require('rimraf');
const { exec } = require('../utils');

const srcPath = path.resolve(appRootPath, 'src');

const isJsFile = file => path.extname(file) === '.js';

const stripTypes = () => {
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

  // Now do an eslint fix parse
  exec(`eslint --fix ${srcPath}`);
};

if (fs.existsSync('src/shared/universal/types')) {
  rimraf('src/shared/universal/types', (err) => {
    if (err) {
      console.error('Could not remove "src/shared/universal/types" directory.');
    } else {
      stripTypes();
    }
  });
} else {
  stripTypes();
}
