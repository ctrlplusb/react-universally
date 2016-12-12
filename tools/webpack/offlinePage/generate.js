/* @flow */

// This is used by the HtmlWebpackPlugin to generate an html page that we will
// use as a fallback for our service worker when the user is offline.  It will
// embed all the required asset paths needed to bootstrap the application
// in an offline session.
//
// You must keep this in sync in terms of structure etc with the output generated
// by the reactApplication middleware.
// @see src/server/middleware/reactApplication/generateHTML.js

import htmlPageConfig from '../../../config/public/htmlPage';

const htmlAttributes = attrs => Object.keys(attrs)
  // $FlowFixMe
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

// $FlowFixMe - for some reason flow type syntax is failing here.
export default function generate(templateParams) { // eslint-disable-line no-unused-vars
  return `
    <!DOCTYPE html>
    <html ${htmlAttributes(htmlPageConfig.htmlAttributes)}>
      <head>
        ${
          htmlPageConfig.defaultTitle
            ? `<title>${htmlPageConfig.defaultTitle}</title>`
            : ''
        }
        ${metaTags(htmlPageConfig.meta)}
        ${linkTags(htmlPageConfig.links)}
      </head>
      <body>
        <div id='app'></div>
        ${
          // Enable the polyfill io script?
          // This can't be configured within a react-helmet component as we
          // may need the polyfill's before our client bundle gets parsed.
          htmlPageConfig.polyfillIO.enabled
            ? scriptTag(htmlPageConfig.polyfillIO.url)
            : ''
        }
        ${scriptTags(htmlPageConfig.scripts)}
      </body>
    </html>`;
}
