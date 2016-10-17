/* @flow */

import React from 'react';
import { Link } from 'react-router';

function Menu() {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </div>
  );
}

export default Menu;
