/* @flow */

import React from 'react';
import Link from 'react-router/lib/Link';
import Helmet from 'react-helmet';

import 'normalize.css/normalize.css';
import './globals.css';

import Logo from './lib/Logo';

const websiteDescription =
  'A starter kit giving you the minimum requirements for a production ready ' +
  'universal react application.';

function App(props : { children : $React$Children }) {
  const { children } = props;
  return (
    <div style={{ padding: '10px' }}>
      {/*
        All of the following will be injected into our page header.
        @see https://github.com/nfl/react-helmet
      */}
      <Helmet
        htmlAttributes={{ lang: 'en' }}
        titleTemplate="React Universally - %s"
        defaultTitle="React Universally"
        meta={[
          { name: 'description', content: websiteDescription },
        ]}
        script={[]}
      />

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Logo />
        <h1>React, Universally</h1>
        <strong>{websiteDescription}</strong>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

export default App;
