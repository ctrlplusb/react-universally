/* @flow */

import type { $Request, $Response, Middleware } from 'express';
import React from 'react';
import { ServerRouter, createServerRenderContext } from 'react-router';
import render from './render';
import fireRouteTasks from '../shared/universal/taskRoutes/runTasksForLocation';
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

  // Set up a function we can call to render the app and return the result via
  // the response.
  const renderApp = () => {
    // First create a context for <ServerRouter>, which will allow us to
    // query for the results of the render.
    const context = createServerRenderContext();

    // Render the app into a string.
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
  };

  // Now we try to attempt to execute any 'prefetchData' tasks that get matched
  // for the given location.
  const executingTasks = fireRouteTasks(
    { pathname: request.originalUrl }, ['prefetchData']
  );

  if (executingTasks) {
    // Some tasks are executing so we will chain the promise, waiting for them
    // to complete before we render the application.
    executingTasks.then(({ routes }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Finished tasks for routes', routes); // eslint-disable-line no-console,max-len
      }

      // The tasks are finished, so lets render the app and return the response.
      renderApp();
    });
  } else {
    // No tasks are being executed so we can render and return the response.
    renderApp();
  }
}

export default (universalReactAppMiddleware : Middleware);
