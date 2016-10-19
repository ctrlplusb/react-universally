/* @flow */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from '../shared/universal/redux/configureStore';
import ReactHotLoader from './components/ReactHotLoader';
import TaskRoutesExecutor from './components/TaskRoutesExecutor';
import App from '../shared/universal/components/App';

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

// Create our Redux store.
const store = configureStore(
  // Server side rendering would have mounted our state on this global.
  window.APP_STATE
);

function renderApp(TheApp) {
  render(
    <ReactHotLoader>
      <Provider store={store}>
        <BrowserRouter>
          {
            routerProps =>
              <TaskRoutesExecutor {...routerProps} dispatch={store.dispatch}>
                <TheApp />
              </TaskRoutesExecutor>
          }
        </BrowserRouter>
      </Provider>
    </ReactHotLoader>,
    container
  );
}

// The following is needed so that we can support hot reloading our application.
if (process.env.NODE_ENV === 'development' && module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js');
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept(
    '../shared/universal/components/App',
    () => renderApp(require('../shared/universal/components/App').default)
  );
}

renderApp(App);
