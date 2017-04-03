import 'normalize.css/normalize.css';

import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Helmet from 'react-helmet';

import './globals.css';

import HomeRoute from './HomeRoute';
import CounterRoute from './CounterRoute';
import AboutRoute from './AboutRoute';
import Error404 from './Error404';
import Header from './Header';

function DemoApp() {
  return (
    <div style={{ padding: '2rem' }}>
      <Helmet>
        {/*
          NOTE: This is simply for quick and easy styling on the demo. Remove
          this and the related items from the Content Security Policy in the
          global config if you have no intention of using milligram.
        */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
        <link rel="stylesheet" href="https://cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css" />
      </Helmet>
      <Header />
      <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Switch>
          <Route exact path="/" component={HomeRoute} />
          <Route path="/counter" component={CounterRoute} />
          <Route path="/about" component={AboutRoute} />
          <Route component={Error404} />
        </Switch>
      </div>
    </div>
  );
}

export default DemoApp;
