/* @flow */

import type { $Request, $Response, Middleware } from 'express';
import React from 'react';
import { ServerRouter, createServerRenderContext } from 'react-router';
import { matchRoutesToLocation } from 'react-router-addons-routes';
import render from './render';
import actionRoutes from '../shared/universal/routing/actionRoutes';
import App from '../shared/universal/components/App';

/**
 * An express middleware that is capabable of doing React server side rendering.
 */
function universalReactAppMiddleware(request: $Request, response: $Response) {
  if (process.env.DISABLE_SSR === 'true') {
    if (process.env.NODE_ENV === 'development') {
      console.log('==> Handling react route without SSR');  // eslint-disable-line no-console
    }
    // SSR is disabled so we will just return an empty html page and will
    // rely on the client to initialize and render the react application.
    const html = render();
    response.status(200).send(html);
    return;
  }

  // First create a context for <ServerRouter>, which will allow us to
  // query for the results of the render.
  const context = createServerRenderContext();

  // Now we try to match the url being requested against our actionRoutes and
  // see if there are any matches.
  const actionRoutesMatchResult = matchRoutesToLocation(
    actionRoutes, { pathname: request.originalUrl }
  );

  // Before we do any rendering we will fire the `prefetchData` action for
  // any of our actionRoutes that were matched.
  Promise.all(
    actionRoutesMatchResult
      // Get the list of action routes which were matched.
      .matchedRoutes
      // Filter the action routes down to those containing a 'prefetchData' action.
      .filter(actionRoute => actionRoute.prefetchData)
      // Then we call the 'prefetchData' action, passing in any routing params.
      // The action should typically return a Promise so that you are able to
      // indicate when the action has completed.
      .map(actionRoute => actionRoute.prefetchData(actionRoutesMatchResult.params))
  ).then((actionRouteResults) => {
    if (actionRouteResults) {
      // If you returned something from your action route results you could
      // do something with it here. e.g. initialise some sort of data store.
    }

    // This is also an opportunity to get the current state of a redux store.

    // Lets now render our app.
    const html = render(
      <ServerRouter
        location={request.url}
        context={context}
      >
        <App />
      </ServerRouter>
    );

    // Get the render result from the server render context.
    const renderResult = context.getResult();

    // Check if the render result contains a redirect, if so we need to set
    // the specific status and redirect header and end the response.
    if (renderResult.redirect) {
      response.status(301).setHeader('Location', renderResult.redirect.pathname);
      response.end();
      return;
    }

    response.status(
      renderResult.missed
        // If the renderResult contains a "missed" match then we set a 404 code.
        // Our App component will handle the rendering of an Error404 view.
        ? 404
        // Otherwiser everthing is all good and we send a 200 OK status.
        : 200
      ).send(html);
  });
}

export default (universalReactAppMiddleware : Middleware);
