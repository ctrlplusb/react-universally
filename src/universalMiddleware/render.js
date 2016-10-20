/* @flow */

import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import clientAssets from './clientAssets';
import type { ReactElement } from '../shared/universal/types/react';

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
function render(reactAppElement : ?ReactElement, initialState : ?Object) {
  const reactApp = reactAppElement
    ? renderToString(reactAppElement)
    : '';

  // If we had a reactAppElement then we need to run Helmet.rewind to extract
  // all the helmet information out of the helmet provider.
  // Note: you need to have called the renderToString on the react element before
  // running this!
  // @see https://github.com/nfl/react-helmet
  const helmet = reactAppElement
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
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta httpEquiv='Content-Language' content='en' />
        <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />

        ${helmet ? helmet.title.toString() : ''}
        ${helmet ? helmet.meta.toString() : ''}
        ${helmet ? helmet.link.toString() : ''}

        ${styles}
        ${helmet ? helmet.style.toString() : ''}

        <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
      </head>
      <body>
        <div id='app'>${reactApp}</div>

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
