import React from 'react';
import Link from 'react-router-dom/Link';

function Menu() {
  return (
    <ul style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#c6c6c6' }}>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/counter">Counter</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>
  );
}

export default Menu;
