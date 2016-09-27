/* @flow */

import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import App from '../components/App';

if (process.env.NODE_ENV === 'development' && module.hot) {
  // HMR does not work 100% if you are using the dynamic component resolution
  // properties (i.e. getComponent or getComponents). Specifically, HMR will
  // work initially but if you change your route (i.e. browse to another part
  // of your app) then the HMR will stop working.
  // As a workaround for this scenario; for any of your components that are
  // resolved dynamically please require them below. If you don't want to
  // maintain this list then you could remove it and instead do a manual browser
  // refresh after changing the route.
  require('../components/App/views/Home'); // eslint-disable-line global-require
  require('../components/App/views/About'); // eslint-disable-line global-require
}

function handleError(err) {
  // TODO: Error handling, do we return an Error component here?
  console.log('==> Error occurred loading dynamic route'); // eslint-disable-line no-console
  console.log(err); // eslint-disable-line no-console
}

// NOTE: Unfortunately we have to declare every async route manually.  We can't
// use a single System.import statement with a dynamic expression for resolving
// a component/view as this is currently broken in target=node webpack bundles.
// @see https://github.com/webpack/webpack/issues/3065
// When this is sorted then we can replace the below functions with a single
// implementation similar to:
// function resolveAsyncView(viewName: string) {
//   return (nextState, cb) => {
//     System.import('../components/App/views/' + viewName + '/index.js')
//       .then(module => cb(null, module.default))
//       .catch(handleError);
//   }
// }
// Additionally we wouldn't need the workaround at the top of the file.  Until
// then, you will need to be a bit verbose here.  Apologies.

function resolveIndexComponent(nextState, cb) {
  System.import('../components/App/views/Home')
    .then(module => cb(null, module.default))
    .catch(handleError);
}

function resolveAboutComponent(nextState, cb) {
  System.import('../components/App/views/About')
    .then(module => cb(null, module.default))
    .catch(handleError);
}

/**
 * Our routes.
 *
 * NOTE: We load our routes asynhronously using the `getComponent` API of
 * react-router, doing so combined with the `System.import` support by
 * webpack 2 allows us to get code splitting based on our routes.
 * @see https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md
 * @see https://gist.github.com/sokra/27b24881210b56bbaff7#code-splitting-with-es6
 */
const routes = (
  <Route path="/" component={App}>
    <IndexRoute getComponent={resolveIndexComponent} />
    <Route path="about" getComponent={resolveAboutComponent} />
  </Route>
);

export default routes;
