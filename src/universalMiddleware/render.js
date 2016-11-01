/* @flow */

import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import clientAssets from './clientAssets';
import type { ReactElement } from '../shared/universal/types/react';

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

function scriptTags(scripts : Array<string>) {
  return scripts
    .map(script =>
      `<script type="text/javascript" src="${script}"></script>`
    )
    .join('\n');
}

const styles = styleTags(clientAssets.styles);

const scripts = scriptTags(clientAssets.scripts);

type RenderArgs = {
  app?: ReactElement,
  initialState?: Object,
  nonce: string,
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
  const { app, initialState, nonce } = args;

  const appString = app
    ? renderToString(app)
    : '';

  // If we had a reactAppElement then we need to run Helmet.rewind to extract
  // all the helmet information out of the helmet provider.
  // Note: you need to have called the renderToString on the react element before
  // running this!
  // @see https://github.com/nfl/react-helmet
  const helmet = app
    // We run 'react-helmet' after our renderToString call so that we can fish
    // out all the attributes which need to be attached to our page.
    // React Helmet allows us to control our page header contents via our
    // components.
    // @see https://github.com/nfl/react-helmet
    ? Helmet.rewind()
    // There was no react element, so we just us an empty helmet.
    : null;

  return `<!DOCTYPE html>
    <html ${helmet ? helmet.htmlAttributes.toString() : ''}>
      <head>
        ${helmet ? helmet.title.toString() : ''}
        ${helmet ? helmet.meta.toString() : ''}
        ${helmet ? helmet.link.toString() : ''}

        ${styles}
        ${helmet ? helmet.style.toString() : ''}

        ${polyfillIoScript()}
        ${serviceWorkerScript(nonce)}
      </head>
      <body>
        <div id='app'>${appString}</div>

        <script type='text/javascript'>${
          initialState
            ? `window.APP_STATE=${serialize(initialState)};`
            : ''
        }</script>

        ${scripts}
        ${helmet ? helmet.script.toString() : ''}
      </body>
    </html>`;
}

export default render;
