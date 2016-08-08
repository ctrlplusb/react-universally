
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
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

const { css, javascript } = clientBundleAssets;
const cssLinks = cssImports(css);
const javascriptScripts = javascriptImports(javascript);

/**
 * Generates a full HTML page containing the render output of the given react
 * element.
 *
 * @param  rootReactElement
 *   [Optional] The root React element to be rendered on the page.
 * @param  initialState
 *   [Optional] The initial state for the redux store which will be used by the
 *   client to mount the redux store into the desired state.
 *
 * @return The full HTML page in the form of a React element.
 */
function render(rootReactElement, initialState) {
  const reactRenderString = rootReactElement
    ? renderToString(rootReactElement)
    : null;

  const helmet = rootReactElement
    // We run 'react-helmet' after our renderToString call so that we can fish
    // out all the attributes which need to be attached to our page.
    // React Helmet allows us to control our page header contents via our
    // components.
    // @see https://github.com/nfl/react-helmet
    ? Helmet.rewind()
    // There was no react element, so we just us an empty helmet.
    : null;

  return `<!DOCTYPE html>
    <html ${helmet && helmet.htmlAttributes.toString()}>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta httpEquiv='Content-Language' content='en' />
        <link rel='shortcut icon' type='image/x-icon' href='/public/favicon.ico' />

        ${helmet && helmet.title.toString()}
        ${helmet && helmet.meta.toString()}
        ${helmet && helmet.link.toString()}
        ${helmet && helmet.style.toString()}

        ${cssLinks}
      </head>
      <body>
        <div id='app'>${reactRenderString}</div>

        <script type='text/javascript'>${
          initialState
            ? `window.APP_STATE=${serialize(initialState)};`
            : ''
        }</script>

        ${helmet && helmet.script.toString()}
        ${javascriptScripts}
      </body>
    </html>`;
}

export default render;
