import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from '../components/App'

function handleError (err) {
  console.log('==> Error occurred loading dynamic route')
  console.log(err)
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
  <Route path='/' component={App}>
    {/* Show the Home component at "/" */}
    <IndexRoute getComponent={(nextState, cb) =>
      System.import('../components/Home').then(module => cb(null, module.default)).catch(handleError)}
    />

    <Route path='about' getComponent={(nextState, cb) =>
      System.import('../components/About').then(module => cb(null, module.default)).catch(handleError)}
    />
  </Route>
)

export default routes
