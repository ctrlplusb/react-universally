/* @flow */

import webpack from 'webpack';
import { extname as pathExtName } from 'path';
import md5 from 'md5';
import fs from 'fs';
import { sync as globSync } from 'glob';
import matchRequire from 'match-require';
import { createNotification } from '../utils';
import config from '../config';

// $FlowFixMe
const packageJSON = require(config.paths.packageJSON);

// We calculate a hash of the package.json's dependencies, which we can use
// to determine if dependencies have changed since the last time we built
// the vendor dll.
const currentDependenciesHash = md5(JSON.stringify(packageJSON.dependencies));

function webpackConfigFactory(modules) {
  return {
    // We only use this for development, so lets always include source maps.
    devtool: 'inline-source-map',
    entry: { [config.development.vendorDLL.name]: modules },
    output: {
      path: config.paths.clientBundle,
      filename: `${config.development.vendorDLL.name}.js`,
      library: config.development.vendorDLL.name,
    },
    plugins: [
      new webpack.DllPlugin({
        path: config.paths.vendorDLLJSON,
        name: config.development.vendorDLL.name,
      }),
    ],
  };
}

function getJsFilesFromDir(targetPath) {
  return ['js', 'jsx'].reduce((acc, ext) =>
    acc.concat(globSync(`${targetPath}/**/*.${ext}`)),
    [],
  );
}

function buildVendorDLL() {
  const ignoreModules = config.development.vendorDLL.ignores;

  return new Promise((resolve, reject) => {
    Promise.all([
      Promise.resolve(getJsFilesFromDir(config.paths.clientSrc)),
      Promise.resolve(getJsFilesFromDir(config.paths.sharedSrc)),
    ])
    .then(([clientFiles, universalFiles]) => {
      const isJsFile = file => pathExtName(file) === '.js';
      const allJSFiles = [...clientFiles, ...universalFiles].filter(isJsFile);
      const modules = allJSFiles.reduce((acc, cur) => {
        const fileContents = fs.readFileSync(cur, 'utf8');
        matchRequire.findAll(fileContents).forEach(match => acc.add(match));
        return acc;
      }, new Set());

      // $FlowFixMe
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
          return;
        }
        // Update the dependency hash
        fs.writeFileSync(config.paths.vendorDLLHash, currentDependenciesHash);

        resolve();
      });
    });
  });
}

function ensureVendorDLLExists() {
  return new Promise((resolve, reject) => {
    if (!config.development.vendorDLL.enabled) {
      resolve();
    }

    if (!fs.existsSync(config.paths.vendorDLLHash)) {
      // builddll
      createNotification({
        title: 'vendorDLL',
        level: 'warn',
        message: 'Generating a new vendor dll for boosted development performance...',
      });
      buildVendorDLL().then(resolve).catch(reject);
    } else {
      // first check if the md5 hashes match
      const dependenciesHash = fs.readFileSync(config.paths.vendorDLLHash, 'utf8');
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

export default ensureVendorDLLExists;
