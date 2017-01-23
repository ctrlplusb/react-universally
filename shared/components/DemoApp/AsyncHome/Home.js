import React from 'react';
import Helmet from 'react-helmet';
import getConfig from '../../../../config/get';

function Home() {
  return (
    <article>
      <Helmet title="Home" />

      <h2>{getConfig('welcomeMessage')}</h2>

      <p>
        This starter kit contains all the build tooling and configuration you
        need to kick off your next universal React project, whilst containing a
        minimal project set up allowing you to make your own architecture
        decisions (Redux/Mobx etc).
      </p>
    </article>
  );
}

export default Home;
