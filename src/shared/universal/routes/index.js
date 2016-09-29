/* @flow */

import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import App from '../components/App';

/**
 * Use this function to provide `getComponent` implementations for your
 * application "views" (i.e. pages). It makes use of webpack 2's System.import
 * feature which allows for the async module loading behavior, and this results
 * in webpack doing code splitting.  So essentially we will get a different
 * code split bundle for each of our views.  Sweet.
 *
 * Notes:
 * 1. Your view components have to reside within the
 *    ~/src/shared/components/App/views folder.  You need to create a folder to
 *    represent your view and then have an index.js file within that will return
 *    the respective view component.
 * 2. The regex that webpack uses to statically calculate which components it
 *    should expose as async has been overridden within the config factory. It
 *    has been overridden so that only the "root" folders within
 *    ~/src/shared/components/App/views will be recognised as async components.
 *    None of the sub folders will be considered.
 *
 * @see https://gist.github.com/sokra/27b24881210b56bbaff7#code-splitting-with-es6
 */
function asyncAppViewResolver(viewName: string) {
  const errorHandler = (err) => {
    console.log(`==> Failed to load async view "${viewName}".`); // eslint-disable-line no-console
    console.log(err); // eslint-disable-line no-console
  };

  return (nextState, cb) =>
    System.import('../components/App/views/' + viewName + '/index.js') // eslint-disable-line prefer-template
      .then(module => cb(null, module.default))
      .catch(errorHandler);
}

/**
 * Our routes.
 *
 * Note: We load our routes asynhronously using the `getComponent` API of
 * react-router, doing so combined with the `System.import` support by
 * webpack 2 allows us to get code splitting based on our routes.
 *
 * @see https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md
 */
const routes = (
  <Route path="/" component={App}>
    <IndexRoute getComponent={asyncAppViewResolver('Home')} />
    <Route path="about" getComponent={asyncAppViewResolver('About')} />
  </Route>
);

export default routes;
