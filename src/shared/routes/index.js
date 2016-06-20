import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from '../components/App'
import Home from '../components/Home'
import About from '../components/About'

const routes = (
  <Route path='/' component={App}>
    {/* Show the Home component at "/" */}
    <IndexRoute component={Home} />
    <Route path='about' component={About} />
  </Route>
)

export default routes
