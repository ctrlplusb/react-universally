/* @flow */

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import reducer from '../reducers';
import type { State } from '../reducers';

// // If we create an '/api' endpoint in our server then we will neeed to
// // configure the axios instances so that it will execute properly on the server.
// // We need to make sure we provide the full url to our API endpoint. To do so
// // we need to set the 'baseURL' configuration property for axios.
// // We don't need to worry about this for client side executions, relative paths
// // will work fine there.
// const axiosConfig = process.env.IS_NODE === true
//   ? { baseURL: process.env.NOW_URL || notEmpty(process.env.SERVER_URL) }
//   : {};
//
// We will then have to initialise the thunk like so:
// thunk.withExtraArgument({
//   axios: axios.create(axiosConfig),
// })

function configureStore(initialState: ?State) {
  const enhancers = compose(
    // Middleware store enhancer.
    applyMiddleware(
      // Initialising redux-thunk with extra arguments will pass the below
      // arguments to all the redux-thunk actions. Below we are passing a
      // preconfigured axios instance which can be used to fetch data with.
      thunk.withExtraArgument({ axios })
    ),
    // Redux Dev Tools store enhancer.
    // @see https://github.com/zalmoxisus/redux-devtools-extension
    // We only want this enhancer enabled for development and when in a browser
    // with the extension installed.
    process.env.NODE_ENV === 'development'
      && typeof window !== 'undefined'
      && typeof window.devToolsExtension !== 'undefined'
      // Call the brower extension function to create the enhancer.
      ? window.devToolsExtension()
      // Else we return a no-op function.
      : f => f
  );

  const store = initialState
    ? createStore(reducer, initialState, enhancers)
    : createStore(reducer, enhancers);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    // Enable Webpack hot module replacement for reducers. This is so that we
    // don't lose all of our current application state during hot reloading.
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default; // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore;
