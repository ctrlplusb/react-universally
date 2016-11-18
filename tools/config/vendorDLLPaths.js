const pathResolve = require('path').resolve;
const appRootPath = require('app-root-dir').get();
const envVars = require('./envVars');

const dllName = 'vendor';
const bundleSubDir = '/client/dlls';
const dllOutputDir = pathResolve(appRootPath, envVars.BUNDLE_OUTPUT_PATH, `.${bundleSubDir}`);
const dllWebPath = `${bundleSubDir}/${dllName}.js`;
const dllPath = pathResolve(dllOutputDir, `${dllName}.js`);
const dllJsonPath = pathResolve(dllOutputDir, `${dllName}.json`);
const dependenciesHashFilePath = pathResolve(dllOutputDir, 'dependencies_hash');

module.exports = {
  dllName,
  dllOutputDir,
  dllPath,
  dllJsonPath,
  dependenciesHashFilePath,
  dllWebPath,
};
