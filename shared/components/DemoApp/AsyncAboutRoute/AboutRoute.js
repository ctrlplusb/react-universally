import React from 'react';
import Helmet from 'react-helmet';

function AboutRoute() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Helmet>
        <title>About</title>
      </Helmet>

      <p>Produced with ❤️</p>

      <p>
        View our contributors list on our
        {' '}
        <a href="https://github.com/ctrlplusb/react-universally">GitHub</a>
        {' '}
        page.
      </p>
    </div>
  );
}

export default AboutRoute;
