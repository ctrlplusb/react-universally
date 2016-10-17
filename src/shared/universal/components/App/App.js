/* @flow */

import React from 'react';
import { Match, Miss } from 'react-router';
import Helmet from 'react-helmet';
import CodeSplit from 'code-split-component';
import 'normalize.css/normalize.css';
import './globals.css';
import Error404 from './views/Error404';
import Header from './Header';
import Menu from './Menu';
import { WEBSITE_TITLE, WEBSITE_DESCRIPTION } from '../../constants';

function MatchWithHeader({ render, ...rest } : { render: Function }) {
  return (
    <Match
      {...rest}
      render={routerProps =>
        <div>
          <Header />
          <Menu />
          {render(routerProps)}
        </div>
      }
    />
  );
}

function App() {
  return (
    <div style={{ padding: '10px' }}>
      {/*
        All of the following will be injected into our page header.
        @see https://github.com/nfl/react-helmet
      */}
      <Helmet
        htmlAttributes={{ lang: 'en' }}
        titleTemplate={`${WEBSITE_TITLE} - %s`}
        defaultTitle={WEBSITE_TITLE}
        meta={[
          { name: 'description', content: WEBSITE_DESCRIPTION },
        ]}
        script={[]}
      />

      <MatchWithHeader
        exactly
        pattern="/"
        render={routerProps =>
          <CodeSplit module={System.import('./views/Home')}>
            { Home => Home && <Home {...routerProps} /> }
          </CodeSplit>
        }
      />

      <MatchWithHeader
        pattern="/about"
        render={routerProps =>
          <CodeSplit module={System.import('./views/About')}>
            { About => About && <About {...routerProps} /> }
          </CodeSplit>
        }
      />

      <Miss component={Error404} />
    </div>
  );
}

export default App;
