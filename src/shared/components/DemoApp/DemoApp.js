import React from 'react';
import { Match, Miss } from 'react-router';
import Helmet from 'react-helmet';
import 'normalize.css/normalize.css';

import './globals.css';

import config from '../../utils/config';

import AsyncHome from './AsyncHome';
import AsyncAbout from './AsyncAbout';
import Error404 from './Error404';
import Header from './Header';

function DemoApp() {
  return (
    <div style={{ padding: '10px' }}>
      {/*
        All of the following will be injected into our page header.
        @see https://github.com/nfl/react-helmet
      */}
      <Helmet
        htmlAttributes={config('htmlPage.htmlAttributes')}
        titleTemplate={config('htmlPage.titleTemplate')}
        defaultTitle={config('htmlPage.defaultTitle')}
        meta={config('htmlPage.meta')}
        link={config('htmlPage.links')}
        script={config('htmlPage.scripts')}
      />

      <Header />

      <Match exactly pattern="/" component={AsyncHome} />
      <Match pattern="/about" component={AsyncAbout} />
      <Miss component={Error404} />
    </div>
  );
}

export default DemoApp;
