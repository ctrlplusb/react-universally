import fs from 'fs';
import path from 'path';
import clientConfigBuilder from '../../../webpack.client.config.js';

// We need to calculate the path to our "assets.json" file describing our
// client webpack bundle, and then read & parse it into json.
const webpackClientConfig = clientConfigBuilder({ mode: process.env.NODE_ENV });
const ClientBundleAssets = JSON.parse(
  fs.readFileSync(
    path.resolve(webpackClientConfig.output.path, './assets.json'),
    'utf8'
  )
);

// Convert the assets json it into an object that contains all the paths to our
// javascript and css files.  Doing this is required as for production
// configurations we add a hash to our filenames, therefore we won't know the
// paths of the output by webpack unless we read them from the assets.json file.
const chunks = Object.keys(ClientBundleAssets).map(key => ClientBundleAssets[key]);
const assets = chunks.reduce((acc, chunk) => {
  if (chunk.js) {
    acc.javascript.push(chunk.js);
  }
  if (chunk.css) {
    acc.css.push(chunk.css);
  }
  return acc;
}, { javascript: [], css: [] });

export default assets;
