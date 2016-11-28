/* @flow */

import React from 'react';
import Helmet from 'react-helmet';

function About() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Helmet title="About" />

      Produced with ❤️
      by
      &nbsp;
      <a href="https://twitter.com/controlplusb" target="_blank" rel="noopener noreferrer">
        Sean Matheson
      </a>
    </div>
  );
}

export default About;
