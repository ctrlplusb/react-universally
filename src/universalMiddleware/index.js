/* @flow */

import type { $Request, $Response, Middleware } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerRouter, createServerRenderContext } from 'react-router';
import { CodeSplitProvider, createRenderContext } from 'code-split-component';
import Helmet from 'react-helmet';
import render from './render';
import App from '../shared/universal/components/App';

/**
 * An express middleware that is capabable of doing React server side rendering.
 */
function universalReactAppMiddleware(request: $Request, response: $Response) {
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = response.locals.nonce;

  if (process.env.DISABLE_SSR === 'true') {
    if (process.env.NODE_ENV === 'development') {
      console.log('==> Handling react route without SSR');  // eslint-disable-line no-console
    }
    // SSR is disabled so we will just return an empty html page and will
    // rely on the client to initialize and render the react application.
    const html = render({
      // Nonce which allows us to safely declare inline scripts.
      nonce,
    });
    response.status(200).send(html);
    return;
  }

  // First create a context for <ServerRouter>, which will allow us to
  // query for the results of the render.
  const reactRouterContext = createServerRenderContext();

  // We also create a context for our <CodeSplitProvider> which will allow us
  // to query which chunks/modules were used during the render process.
  const codeSplitContext = createRenderContext();

  // Create the application react element.
  const app = (
    <CodeSplitProvider context={codeSplitContext}>
      <ServerRouter location={request.url} context={reactRouterContext}>
        <App />
      </ServerRouter>
    </CodeSplitProvider>
  );

  // Render the app to a string.
  const html = render({
    // Provide the full app react element.
    app: renderToString(app),
    // Nonce which allows us to safely declare inline scripts.
    nonce,
    // We query the 'react-helmet' after our rendering so that we can get
    // out all the attributes which will need to be attached to our page.
    // @see https://github.com/nfl/react-helmet
    helmet: Helmet.rewind(),
    // The code split state.
    codeSplitState: codeSplitContext.getState(),
  });

  // Get the render result from the server render context.
  const renderResult = reactRouterContext.getResult();

  // Check if the render result contains a redirect, if so we need to set
  // the specific status and redirect header and end the response.
  if (renderResult.redirect) {
    response.status(301).setHeader('Location', renderResult.redirect.pathname);
    response.end();
    return;
  }

  response
    .status(
      renderResult.missed
        // If the renderResult contains a "missed" match then we set a 404 code.
        // Our App component will handle the rendering of an Error404 view.
        ? 404
        // Otherwise everything is all good and we send a 200 OK status.
        : 200
    )
    .send(html);
}

export default (universalReactAppMiddleware : Middleware);
