const webpack = require('webpack');
const pathExtName = require('path').extname;
const pathResolve = require('path').resolve;
const md5 = require('md5');
const fs = require('fs');
const globSync = require('glob').sync;
const appRootPath = require('app-root-dir').get();
const vendorDLLPaths = require('../config/vendorDLLPaths');
const { createNotification } = require('../utils');
const envVars = require('../config/envVars');
const matchRequire = require('match-require');

// -----------------------------------------------------------------------------
// PRIVATES

const {
  dllName,
  dllOutputDir,
  dllJsonPath,
  dependenciesHashFilePath,
} = vendorDLLPaths;

// We calculate a hash of the package.json's dependencies, which we can use
// to determine if dependencies have changed since the last time we built
// the vendor dll.
const currentDependenciesHash = md5(
  JSON.stringify(require(pathResolve(appRootPath, 'package.json')).dependencies)
);

function webpackConfigFactory(modules) {
  return {
    // We only use this for development, so lets always include source maps.
    devtool: 'inline-source-map',
    entry: { [dllName]: modules },
    output: {
      path: dllOutputDir,
      filename: `${dllName}.js`,
      library: dllName,
    },
    plugins: [
      new webpack.DllPlugin({
        path: dllJsonPath,
        name: dllName,
      }),
    ],
  };
}

function getJsFilesFromSrcDir(srcPath) {
  return globSync(`${pathResolve(appRootPath, 'src', srcPath)}/**/*.js`);
}

function buildVendorDLL() {
  const ignoreModules = envVars.DEV_DLL_IGNORES
    ? envVars.DEV_DLL_IGNORES.split(',')
    : [];

  return new Promise((resolve, reject) => {
    Promise.all([
      Promise.resolve(getJsFilesFromSrcDir('client')),
      Promise.resolve(getJsFilesFromSrcDir('shared/universal')),
    ])
    .then(([clientFiles, universalFiles]) => {
      const isJsFile = file => pathExtName(file) === '.js';
      const allJSFiles = [...clientFiles, ...universalFiles].filter(isJsFile);
      const modules = allJSFiles.reduce((acc, cur) => {
        const fileContents = fs.readFileSync(cur, 'utf8');
        matchRequire.findAll(fileContents).forEach(match => acc.add(match));
        return acc;
      }, new Set());

      const filteredModules = [...modules]
        // Remove any modules that have been configured to be ignored.
        .filter(module => ignoreModules.findIndex(x => x === module) === -1)
        // We only want to include absolute imports, no relative required modules.
        .filter(module => !matchRequire.isRelativeModule(module));

      createNotification({
        title: 'vendorDLL',
        level: 'info',
        message: 'Vendor DLL build complete. Check console for module list.',
      });
      console.log(filteredModules);

      const webpackConfig = webpackConfigFactory(filteredModules);
      const vendorDLLCompiler = webpack(webpackConfig);
      vendorDLLCompiler.run((err) => {
        if (err) {
          reject(err);
        }
        // Update the dependency hash
        if (!fs.existsSync(dllOutputDir)) {
          fs.mkdirSync(dllOutputDir);
        }
        fs.writeFileSync(dependenciesHashFilePath, currentDependenciesHash);

        resolve();
      });
    });
  });
}

// -----------------------------------------------------------------------------
// DEFAULT EXPORT

function ensureVendorDLLExists() {
  return new Promise((resolve, reject) => {
    if (envVars.USE_DEV_DLL !== 'true') {
      resolve();
    }

    if (!fs.existsSync(dependenciesHashFilePath)) {
      // builddll
      createNotification({
        title: 'vendorDLL',
        level: 'warn',
        message: 'Generating a new vendor dll for boosted development performance...',
      });
      buildVendorDLL().then(resolve).catch(reject);
    } else {
      // first check if the md5 hashes match
      const dependenciesHash = fs.readFileSync(dependenciesHashFilePath, 'utf8');
      const dependenciesChanged = dependenciesHash !== currentDependenciesHash;

      if (dependenciesChanged) {
        createNotification({
          title: 'vendorDLL',
          level: 'warn',
          message: 'New vendor dependencies detected. Regenerating the vendor dll...',
        });
        buildVendorDLL().then(resolve).catch(reject);
      } else {
        createNotification({
          title: 'vendorDLL',
          level: 'info',
          message: 'No changes to existing vendor dependencies. Using the existing vendor dll.',
        });
        resolve();
      }
    }
  });
}

module.exports = ensureVendorDLLExists;
