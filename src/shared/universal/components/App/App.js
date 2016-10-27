/* @flow */

import React from 'react';
import { Match, Miss } from 'react-router';
import Helmet from 'react-helmet';
import CodeSplit from 'code-split-component';
import 'normalize.css/normalize.css';
import './globals.css';
import Error404 from './Error404';
import Header from './Header';
import { WEBSITE_TITLE, WEBSITE_DESCRIPTION } from '../../constants';

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
          { name: 'charset', content: 'utf-8' },
          // This is important to signify your application is mobile responsive!
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { name: 'description', content: WEBSITE_DESCRIPTION },
          // Providing a theme color is good if you are doing a progressive
          // web application.
          { name: 'theme-color', content: '#2b2b2b' },
        ]}
        link={[
          // When building a progressive web application you need to supply
          // a manifest.json as well as a host of icon types. This can be
          // tricky. Luckily there is a service to help you with this.
          // http://realfavicongenerator.net/
          // Go there and generate your icon pack and then extract them into
          // the public folder.
          { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
          { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
          { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
          { rel: 'manifest', href: '/manifest.json' },
          { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#00a9d9' },
        ]}
        script={[]}
      />

      <Header />

      <Match
        exactly
        pattern="/"
        render={routerProps =>
          <CodeSplit module={System.import('./Home')}>
            { Home => Home && <Home {...routerProps} /> }
          </CodeSplit>
        }
      />

      <Match
        pattern="/about"
        render={routerProps =>
          <CodeSplit module={System.import('./About')}>
            { About => About && <About {...routerProps} /> }
          </CodeSplit>
        }
      />

      <Miss component={Error404} />
    </div>
  );
}

export default App;
