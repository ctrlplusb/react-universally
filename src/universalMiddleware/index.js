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
    // rely on the client to populate the initial react application state.
    const html = render();
    response.status(200).send(html);
    return;
  }

  // first create a context for <ServerRouter>, it's where we keep the
  // results of rendering for the second pass if necessary
  const context = createServerRenderContext();

  const matchResult = matchRoutesToLocation(
    actionRoutes, { pathname: request.originalUrl }
  );

  const { matchedRoutes, params } = matchResult;

  Promise.all(
    matchedRoutes
      // We filter down the action routes to those containing a 'prefetchData' action.
      .filter(actionRoute => actionRoute.prefetchData)
      // Then we call the 'prefetchData' action, passing in any routing params.
      // The action should typically return a Promise so that you are able to
      // indicate when the action has completed.
      .map(actionRoute => actionRoute.prefetchData(params))
  ).then((data) => {
    if (data) {
      // Do something with the data. e.g. init redux store? :)
    }

    const html = render(
      <ServerRouter
        location={request.url}
        context={context}
      >
        <App />
      </ServerRouter>
    );

    // get the result
    const result = context.getResult();

    // the result will tell you if it redirected, if so, we ignore
    // the markup and send a proper redirect.
    if (result.redirect) {
      response.status(301).setHeader('Location', result.redirect.pathname);
      response.end();
      return;
    }

    // // the result will tell you if there were any misses, if so
    // // we can send a 404 and then do a second render pass with
    // // the context to clue the <Miss> components into rendering
    // // this time (on the client they know from componentDidMount)
    // if (result.missed) {
    //   response.status(404).send(render(<Error404 />));
    //   return;
    // }

    response.status(result.missed ? 404 : 200).send(html);
  });

  /*
  const history = createMemoryHistory(request.originalUrl);

  // Server side handling of react-router.
  // Read more about this here:
  // https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
  match({ routes, history }, (error, redirectLocation, renderProps) => {
    if (error) {
      response.status(500).send(error.message);
    } else if (redirectLocation) {
      response.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const html = render(<RouterContext {...renderProps} />);
      response.status(200).send(html);
    } else {
      // No route was matched.
      const html = render(<Error404 />);
      response.status(404).send(html);
    }
  });
  */
}

export default (universalReactAppMiddleware : Middleware);
