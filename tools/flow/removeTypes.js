const globSync = require('glob').sync;
const path = require('path');
const appRootPath = require('app-root-path').toString();
const flowRemoveTypes = require('flow-remove-types');
const fs = require('fs');
const rimraf = require('rimraf');

const isJsFile = file => path.extname(file) === '.js';

const stripTypes = () => {
  var files = globSync(`${path.resolve(appRootPath, 'src')}/**/*.js`);
  files.filter(isJsFile).forEach(file => {
    console.log(`Removing types from "${file}`);
    var input = fs.readFileSync(file, 'utf8');
    var output = flowRemoveTypes(input);
    fs.writeFileSync(file, output);
  });
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
