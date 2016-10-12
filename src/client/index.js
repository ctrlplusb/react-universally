/* @flow */

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router';
// import { matchRoutesToLocation } from 'react-router-addons-routes';
// import actionRoutes from '../shared/universal/routing/actionRoutes';
import App from '../shared/universal/components/frames/App';

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

function renderApp(TheApp) {
  // const result = matchRoutesToLocation(actionRoutes, window.location);
  // const { matchedRoutes, params } = result;
  //
  // Promise.all(
  //   matchedRoutes
  //     // We filter down to the components with a "loadData" static function.
  //     .filter(dataRoute => dataRoute.prefetch)
  //     // Then we call the static function, passing in any routing params
  //     // The static functions should typically return Promises to be able to
  //     // indicate when their data fetching process has completed.
  //     .map(dataRoute => dataRoute.prefetch(params))
  // ).then((data) => {
  //   if (data) {
  //     // Do something with the data. e.g. init redux store? :)
  //   }
  //   // Render
  // });

  render(
    <AppContainer>
      <BrowserRouter>
        <TheApp />
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
    '../shared/universal/components/frames/App',
    () => renderApp(require('../shared/universal/components/frames/App').default)
  );
}

renderApp(App);
