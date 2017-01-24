import React from 'react';
import { Match, Miss } from 'react-router';
import 'normalize.css/normalize.css';

import './globals.css';

import AsyncHome from './AsyncHome';
import AsyncAbout from './AsyncAbout';
import Error404 from './Error404';
import Header from './Header';

function DemoApp() {
  return (
    <div style={{ padding: '10px' }}>
      <Header />

      <Match exactly pattern="/" component={AsyncHome} />
      <Match pattern="/about" component={AsyncAbout} />
      <Miss component={Error404} />
    </div>
  );
}

export default DemoApp;
