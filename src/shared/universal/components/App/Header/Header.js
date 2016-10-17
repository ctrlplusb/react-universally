/* @flow */

import React from 'react';
import Logo from './Logo';
import { WEBSITE_DESCRIPTION } from '../../../constants';

function Header() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <Logo />
      <h1>React, Universally</h1>
      <strong>{WEBSITE_DESCRIPTION}</strong>
    </div>
  );
}

export default Header;
