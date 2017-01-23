/**
 * This is used by the HtmlWebpackPlugin to generate an html page that we will
 * use as a fallback for our service worker when the user is offline.  It will
 * embed all the required asset paths needed to bootstrap the application
 * in an offline session.
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import HTML from '../../src/shared/components/HTML';

module.exports = function generate(context) {
  const config = context.htmlWebpackPlugin.options.custom.config;
  const html = renderToStaticMarkup(
    <HTML
      title={config.htmlPage.defaultTitle}
      description={config.htmlPage.description}
    />,
  );
  return `<!DOCTYPE html>${html}`;
};
