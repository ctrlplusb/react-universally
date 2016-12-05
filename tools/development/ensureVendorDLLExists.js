/* @flow */

import webpack from 'webpack';
import { extname as pathExtName, resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import md5 from 'md5';
import fs from 'fs';
import { sync as globSync } from 'glob';
import matchRequire from 'match-require';
import { createNotification } from '../utils';
import staticConfig from '../../config/static';

const appRootPath = appRootDir.get();

// $FlowFixMe
const packageJSON = require(pathResolve(appRootPath, './package.json'));

// We calculate a hash of the package.json's dependencies, which we can use
// to determine if dependencies have changed since the last time we built
// the vendor dll.
const currentDependenciesHash = md5(JSON.stringify(packageJSON.dependencies));

const vendorDLLHashFilePath = pathResolve(
  appRootPath,
  staticConfig.clientBundle.outputPath,
  `${staticConfig.development.vendorDLL.name}_hash`,
);

console.log(vendorDLLHashFilePath);

function webpackConfigFactory(modules) {
  return {
    // We only use this for development, so lets always include source maps.
    devtool: 'inline-source-map',
    entry: { [staticConfig.development.vendorDLL.name]: modules },
    output: {
      path: pathResolve(appRootPath, staticConfig.clientBundle.outputPath),
      filename: `${staticConfig.development.vendorDLL.name}.js`,
      library: staticConfig.development.vendorDLL.name,
    },
    plugins: [
      new webpack.DllPlugin({
        path: pathResolve(
          appRootPath,
          staticConfig.clientBundle.outputPath,
          `${staticConfig.development.vendorDLL.name}.json`,
        ),
        name: staticConfig.development.vendorDLL.name,
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
  const ignoreModules = staticConfig.development.vendorDLL.ignores;

  return new Promise((resolve, reject) => {
    Promise.all([
      Promise.resolve(
        getJsFilesFromDir(
          pathResolve(appRootPath, staticConfig.clientBundle.srcPath),
        ),
      ),
      Promise.resolve(
        getJsFilesFromDir(
          pathResolve(appRootPath, staticConfig.bundlesSharedSrcPath),
        ),
      ),
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
      console.log(JSON.stringify(webpackConfig, null, 4));
      const vendorDLLCompiler = webpack(webpackConfig);
      vendorDLLCompiler.run((err) => {
        if (err) {
          reject(err);
          return;
        }
        // Update the dependency hash
        fs.writeFileSync(vendorDLLHashFilePath, currentDependenciesHash);

        resolve();
      });
    });
  });
}

function ensureVendorDLLExists() {
  return new Promise((resolve, reject) => {
    if (!staticConfig.development.vendorDLL.enabled) {
      resolve();
    }

    if (!fs.existsSync(vendorDLLHashFilePath)) {
      // builddll
      createNotification({
        title: 'vendorDLL',
        level: 'warn',
        message: 'Generating a new vendor dll for boosted development performance...',
      });
      buildVendorDLL().then(resolve).catch(reject);
    } else {
      // first check if the md5 hashes match
      const dependenciesHash = fs.readFileSync(vendorDLLHashFilePath, 'utf8');
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
