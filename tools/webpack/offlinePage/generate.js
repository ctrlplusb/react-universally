/* @flow */

// This is used by the HtmlWebpackPlugin to generate an html page that we will
// use as a fallback for our service worker when the user is offline.  It will
// embed all the required asset paths needed to bootstrap the application
// in an offline session.
//
// You must keep this in sync in terms of structure etc with the output generated
// by the reactApplication middleware.
// @see src/server/middleware/reactApplication/generateHTML.js

import serialize from 'serialize-javascript';

const htmlAttributes = attrs => Object.keys(attrs)
  .map(attrName => `${attrName}="${attrs[attrName]}"`)
  .join(' ');

const metaTags = metas =>
  metas.map(metaItem => `<meta ${htmlAttributes(metaItem)}>`).join(' ');

const linkTags = links =>
  links.map(linkItem => `<link ${htmlAttributes(linkItem)}>`).join(' ');

const scriptTags = scripts =>
  scripts
    .map(scriptItem => `<script ${htmlAttributes(scriptItem)}></script>`)
    .join(' ');

const scriptTag = url => `<script type="text/javascript" src="${url}"></script>`;

// $FlowFixMe - flow annotations don't work here :(
export default function generate(templateParams) {
  const { config, clientConfig } = templateParams.htmlWebpackPlugin.options.custom;

  return `
    <!DOCTYPE html>
    <html ${htmlAttributes(config.htmlPage.htmlAttributes)}>
      <head>
        <title>${config.htmlPage.defaultTitle}</title>
        ${metaTags(config.htmlPage.meta)}
        ${linkTags(config.htmlPage.links)}
      </head>
      <body>
        <div id='app'></div>
        <script type="text/javascript" nonce="NONCE_TARGET">
          ${
            // Binds the client configuration object to the window object so
            // that we can safely expose some configuration values to the
            // client bundle that gets executed in the browser.
            `window.__CLIENT_CONFIG__=${serialize(clientConfig)};`
          }
        </script>
        ${
          // Enable the polyfill io script?
          // This can't be configured within a react-helmet component as we
          // may need the polyfill's before our client bundle gets parsed.
          config.polyfillIO.enabled
            ? scriptTag(config.polyfillIO.url)
            : ''
        }
        ${scriptTags(config.htmlPage.scripts)}
      </body>
    </html>`;
}
