/* @flow */

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router';
import App from '../shared/universal/components/App';

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

function renderApp(TheApp) {
  render(
    <AppContainer>
      <BrowserRouter>
        {routerProps => <TheApp {...routerProps} />}
      </BrowserRouter>
    </AppContainer>,
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
