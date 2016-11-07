/* @flow */

import type { Head } from 'react-helmet';
import serialize from 'serialize-javascript';
import { STATE_IDENTIFIER } from 'code-split-component';
import getAssetsForClientChunks from './getAssetsForClientChunks';

// We use the polyfill.io service which provides the polyfills that a
// client needs, rather than everything if we used babel-polyfill.
// This keeps our bundle size down.
// Note: this has to be included here, rather than imported via react-helmet
// as we may need the polyfills to load our app in the first place! :)
function polyfillIoScript() {
  return '<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>';
}

// We use a service worker configured created by the sw-precache webpack plugin,
// providing us with prefetched caching and offline application support.
// @see https://github.com/goldhand/sw-precache-webpack-plugin
function serviceWorkerScript(nonce) {
  if (process.env.NODE_ENV === 'production') {
    return `
      <script nonce="${nonce}" type="text/javascript">
        (function swRegister() {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
          }
        }());
      </script>`;
  }
  return '';
}

function styleTags(styles : Array<string>) {
  return styles
    .map(style =>
      `<link href="${style}" media="screen, projection" rel="stylesheet" type="text/css" />`
    )
    .join('\n');
}

function scriptTag(jsFilePath: string) {
  return `<script type="text/javascript" src="${jsFilePath}"></script>`;
}

function scriptTags(jsFilePaths : Array<string>) {
  return jsFilePaths.map(scriptTag).join('\n');
}

// When we are in development mode our development server will generate a
// vendor DLL in order to dramatically reduce our compilation times.  Therefore
// we need to inject the path to the vendor dll bundle below.
// @see /tools/development/ensureVendorDLLExists.js
function developmentVendorDLL() {
  if (process.env.NODE_ENV === 'development') {
    const vendorPaths = require('../../tools/config/vendorDLLPaths'); // eslint-disable-line global-require

    return scriptTag(vendorPaths.dllWebPath);
  }
  return '';
}

type RenderArgs = {
  app?: string,
  initialState?: Object,
  nonce: string,
  helmet?: Head,
  codeSplitState?: { chunks: Array<string>, modules: Array<string> };
};

/**
 * Generates a full HTML page containing the render output of the given react
 * element.
 *
 * @param  reactAppElement
 *   [Optional] The react element representing our app to be rendered within the page.
 * @param  initialState
 *   [Optional] A state object to be mounted on window.APP_STATE.
 *   Useful for rehydrating state management containers like Redux/Mobx etc.
 *
 * @return The full HTML page in the form of a React element.
 */
function render(args: RenderArgs) {
  const { app, initialState, nonce, helmet, codeSplitState } = args;

  // The chunks that we need to fetch the assets (js/css) for and then include
  // said assets as script/style tags within our html.
  const chunksForRender = [
    // We always manually add the main entry chunk for our client bundle. It
    // must always be the first item in the collection.
    'index',
  ];

  if (codeSplitState) {
    // We add all the chunks that our CodeSplitProvider tracked as being used
    // for this render.  This isn't actually required as the rehydrate function
    // of code-split-component which gets executed in our client bundle will
    // ensure all our required chunks are loaded, but its a nice optimisation as
    // it means the browser can start fetching the required files before it's
    // even finished parsing our client bundle entry script.
    // Having the assets.json file available to us made implementing this
    // feature rather arbitrary.
    codeSplitState.chunks.forEach(chunk => chunksForRender.push(chunk));
  }

  // Now we get the assets (js/css) for the chunks.
  const assetsForRender = getAssetsForClientChunks(chunksForRender);

  const inlineScript = body =>
    `<script nonce="${nonce}" type='text/javascript'>
       ${body}
     </script>`;

  return `<!DOCTYPE html>
    <html ${helmet ? helmet.htmlAttributes.toString() : ''}>
      <head>
        ${helmet ? helmet.title.toString() : ''}
        ${helmet ? helmet.meta.toString() : ''}
        ${helmet ? helmet.link.toString() : ''}
        ${styleTags(assetsForRender.css)}
        ${helmet ? helmet.style.toString() : ''}
      </head>
      <body>
        <div id='app'>${app || ''}</div>

        ${initialState
           ? inlineScript(`window.APP_STATE=${serialize(initialState)};`)
           : ''
         }
         ${codeSplitState
            ? inlineScript(`window.${STATE_IDENTIFIER}=${serialize(codeSplitState)};`)
            : ''
          }
        ${polyfillIoScript()}
        ${serviceWorkerScript(nonce)}
        ${developmentVendorDLL()}
        ${scriptTags(assetsForRender.js)}
        ${helmet ? helmet.script.toString() : ''}
      </body>
    </html>`;
}

export default render;
