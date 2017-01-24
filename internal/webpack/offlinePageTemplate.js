/**
 * This is used by the HtmlWebpackPlugin to generate an html page that we will
 * use as a fallback for our service worker when the user is offline.  It will
 * embed all the required asset paths needed to bootstrap the application
 * in an offline session.
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import HTML from '../../shared/components/HTML';

module.exports = function generate(context) {
  const getConfig = context.htmlWebpackPlugin.options.custom.getConfig;
  const ClientConfigScript = context.htmlWebpackPlugin.options.custom.ClientConfigScript;
  const html = renderToStaticMarkup(
    <HTML
      title={getConfig('htmlPage.defaultTitle')}
      description={getConfig('htmlPage.description')}
      bodyElements={<ClientConfigScript />}
    />,
  );
  return `<!DOCTYPE html>${html}`;
};
