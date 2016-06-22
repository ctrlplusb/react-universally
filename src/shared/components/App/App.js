import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function Main({ children }) {
  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h1>React, Universally</h1>
        <strong>A mildly opinionated ultra low dependency universal react boilerplate.</strong>
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
Main.propTypes = {
  children: PropTypes.node,
};

export default Main;
