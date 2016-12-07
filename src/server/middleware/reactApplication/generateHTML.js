/* @flow */

// This module is responsible for generating the HTML page response for
// the react application middleware.
//
// NOTE: If you are using a service worker to support offline mode for your
// application then please make sure that you keep the structure of the html
// within this module in sync with the module used to generate the offline
// HTML page.
// @see ./tools/webpack/offlinePage/generate.js

import type { Head } from 'react-helmet';
import serialize from 'serialize-javascript';
import { STATE_IDENTIFIER } from 'code-split-component';
import getAssetsForClientChunks from './getAssetsForClientChunks';
import projConfig from '../../../../config/private/project';
import htmlPageConfig from '../../../../config/public/htmlPage';

function styleTags(styles : Array<string>) {
  return styles
    .map(style =>
      `<link href="${style}" media="screen, projection" rel="stylesheet" type="text/css" />`,
    )
    .join('\n');
}

function scriptTag(jsFilePath: string) {
  return `<script type="text/javascript" src="${jsFilePath}"></script>`;
}

function scriptTags(jsFilePaths : Array<string>) {
  return jsFilePaths.map(scriptTag).join('\n');
}

type Args = {
  app?: string,
  initialState?: Object,
  nonce: string,
  helmet?: Head,
  codeSplitState?: { chunks: Array<string>, modules: Array<string> },
};

export default function generateHTML(args: Args) {
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

  // Creates an inline script definition that is protected by the nonce.
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
        ${
          // Bind the initial application state based on the server render
          // so the client can register the correct initial state for the view.
          initialState
            ? inlineScript(`window.APP_STATE=${serialize(initialState)};`)
            : ''
        }
        ${
          // Bind our code split state so that the client knows which server
          // rendered modules need to be rehydrated.
          codeSplitState
            ? inlineScript(`window.${STATE_IDENTIFIER}=${serialize(codeSplitState)};`)
            : ''
        }
        ${
          // Enable the polyfill io script?
          // This can't be configured within a react-helmet component as we
          // may need the polyfill's before our client bundle gets parsed.
          htmlPageConfig.polyfillIO.enabled
            ? scriptTag(htmlPageConfig.polyfillIO.url)
            : ''
        }
        ${
          // When we are in development mode our development server will generate a
          // vendor DLL in order to dramatically reduce our compilation times.  Therefore
          // we need to inject the path to the vendor dll bundle below.
          // @see /tools/development/ensureVendorDLLExists.js
          process.env.NODE_ENV === 'development'
            ? scriptTag(`${projConfig.bundles.client.webPath}${projConfig.bundles.client.devVendorDLL.name}.js`)
            : ''
        }
        ${scriptTags(assetsForRender.js)}
        ${helmet ? helmet.script.toString() : ''}
      </body>
    </html>`;
}
