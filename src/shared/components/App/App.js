import 'normalize.css/normalize.css';
import './globals.css';

import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

function App({ children }) {
  return (
    <div style={{ padding: '10px' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>React, Universally</h1>
        <strong>
          An ultra low dependency node v6 universal react boilerplate with
          an amazing dev experience.
        </strong>
      </div>
      <div>
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
App.propTypes = {
  children: PropTypes.node,
};

export default App;
