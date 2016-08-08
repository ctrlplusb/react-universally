
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import clientBundleAssets from './clientBundleAssets';

// :: [String] -> [String]
function cssImports(css) {
  return css
    .map(cssPath =>
      `<link href="${cssPath}" media="screen, projection" rel="stylesheet" type="text/css" />`
    )
    .join('\n');
}

// :: [String] -> [String]
function javascriptImports(javascript) {
  return javascript
    .map(scriptPath =>
      `<script type="text/javascript" src="${scriptPath}"></script>`
    )
    .join('\n');
}

// :: Object -> [String]
function metaTags(meta) {
  return Object.keys(meta).map(metaKey =>
    `<meta name="${metaKey}" content="${meta[metaKey]}" />`
  );
}

const { css, javascript } = clientBundleAssets;
const cssLinks = cssImports(css);
const javascriptScripts = javascriptImports(javascript);

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
function render({ rootElement, initialState, title, meta } = {}) {
  return `<!DOCTYPE html>
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta httpEquiv='Content-Language' content='en' />

        <title>${title || process.env.WEBSITE_TITLE}</title>

        ${
          metaTags(Object.assign(
            {},
            { description: process.env.WEBSITE_DESCRIPTION },
            meta || {}
          ))
        }

        ${cssLinks}
      </head>
      <body>
        <div id='app'>${rootElement
            ? renderToString(rootElement)
            : ''
        }</div>

        <script type='text/javascript'>${
          initialState
            ? `window.APP_STATE=${serialize(initialState)};`
            : ''
        }</script>

        <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
        ${javascriptScripts}
      </body>
    </html>`;
}

export default render;
