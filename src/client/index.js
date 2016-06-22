import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Router, browserHistory } from 'react-router'
import routes from '../shared/routes'

// Get the DOM Element that will host our React application.
const container = document.getElementById('app')

function renderApp () {
  render(
    <AppContainer>
      {/*
      We need to explicly render the Router component here instead of have
      this embedded within an App type of component as we use different
      router base components for client vs server rendering.
      */}
      <Router routes={routes} history={browserHistory} />
    </AppContainer>,
    container
  )
}

// The following is needed so that we can hot reload our App.
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept()
  module.hot.accept('../shared/routes', renderApp)
}

renderApp()
