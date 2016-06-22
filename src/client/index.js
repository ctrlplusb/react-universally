import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Router, browserHistory, match } from 'react-router'
import routes from '../shared/routes'

// Get the DOM Element that will host our React application.
const container = document.getElementById('app')

function renderApp () {
  // As we are using asynchronous react-router routes we have to use the following
  // asynchronous match->callback strategy.
  // @see https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
  match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
    if (error) {
      // TODO: Error handling.
      console.log('==> 😭  React Router matching failed.')
    }

    render(
      <AppContainer>
        {/*
        We need to explicly render the Router component here instead of have
        this embedded within a shared App type of component as we use different
        router base components for client vs server rendering.
        */}
        <Router {...renderProps} />
      </AppContainer>,
      container
    )
  })
}

// The following is needed so that we can hot reload our App.
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept()
  module.hot.accept('../shared/routes', renderApp)
}

renderApp()
