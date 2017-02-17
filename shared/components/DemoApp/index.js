import 'normalize.css/normalize.css';

import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import './globals.css';

import AsyncHome from './AsyncHome';
import AsyncAbout from './AsyncAbout';
import Error404 from './Error404';
import Header from './Header';

function DemoApp() {
  return (
    <div style={{ padding: '10px' }}>
      <Header />
      <Switch>
        <Route exact path="/" component={AsyncHome} />
        <Route path="/about" component={AsyncAbout} />
        <Route component={Error404} />
      </Switch>
    </div>
  );
}

export default DemoApp;
