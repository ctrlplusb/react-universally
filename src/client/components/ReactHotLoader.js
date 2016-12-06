/* @flow */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import type { ReactChildren } from '../../shared/types/react';

// We create this wrapper so that we only import react-hot-laoder for a
// development build.  Small savings. :)
const ReactHotLoader =
  process.env.NODE_ENV === 'development'
  ? require('react-hot-loader').AppContainer
  : ({ children } : { children?: ReactChildren}) => React.Children.only(children);

export default ReactHotLoader;
