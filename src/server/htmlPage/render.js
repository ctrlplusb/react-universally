import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';
import createTemplate from './createTemplate';
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

// We prepare a template using the asset data.
const template = createTemplate(assets);

/**
 * Generates a full HTML page containing the render output of the given react
 * element.
 *
 * @param  rootElement
 *   [Optional] The root React element to be rendered on the page.
 * @param  initialState
 *   [Optional] The initial state for the redux store which will be used by the
 *   client to mount the redux store into the desired state.
 * @param  title
 *   [Optional] The tile for the page.
 * @param  meta
 *   [Optional] An object map representing the meta nodes for the page.
 *
 * @return The full HTML page in the form of a React element.
 */
function render({ rootElement, initialState, title, meta = {} } = {}) {
  return template({
    title: title || process.env.WEBSITE_TITLE,
    meta: Object.assign(
      {},
      { description: process.env.WEBSITE_DESCRIPTION },
      meta
    ),
    reactRootElement: rootElement ? renderToString(rootElement) : '',
    initialState,
  });
}

export default render;
