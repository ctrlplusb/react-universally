/* @flow */

import React from 'react';
import Helmet from 'react-helmet';

function Home() {
  return (
    <article>
      <Helmet title="Home" />

      <p>
        This boilerplate contains a super minimal project configuration and
        structure, providing you with everything you need to kick off your next
        universal react project. It focuses on the build and developer tools.
        The actual react project architecture is all up to you.
      </p>

      <p>
        It doesn't try to dictate how you should build your entire application,
        rather it provides a clean and simple base on which you can expand.
      </p>
    </article>
  );
}

export default Home;
