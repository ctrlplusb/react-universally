/* @flow */

import React from 'react';
import { Link, Match, Miss } from 'react-router';
import Helmet from 'react-helmet';
import CodeSplit from 'code-split-component';
import 'normalize.css/normalize.css';
import './globals.css';
import Error404 from '../../errors/Error404';
import Logo from '../../lib/Logo';

const WEBSITE_DESCRIPTION =
  'A starter kit giving you the minimum requirements for a production ready ' +
  'universal react application.';

function App() {
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
          { name: 'description', content: WEBSITE_DESCRIPTION },
        ]}
        script={[]}
      />

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Logo />
        <h1>React, Universally</h1>
        <strong>{WEBSITE_DESCRIPTION}</strong>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>
      <div>
        <Match
          exactly
          pattern="/"
          render={() =>
            <CodeSplit module={require('../../views/Home')}>
              { Home => (Home ? <Home /> : <div>Loading...</div>) }
            </CodeSplit>
          }
        />

        <Match
          pattern="/about"
          render={() =>
            <CodeSplit module={require('../../views/About')}>
              { About => (About ? <About /> : <div>Loading...</div>) }
            </CodeSplit>
          }
        />

        <Miss component={Error404} />
      </div>
    </div>
  );
}

export default App;
