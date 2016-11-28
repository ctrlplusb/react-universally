/* @flow */

// Note: we already have the definitions from
// https://github.com/facebook/flow/blob/master/lib/react.js
// so the below are merely helpful extensions.

import React from 'react';

export type ReactElement = React.Element<any>;

export type ReactNode = string | number | ReactElement | Array<ReactElement>;

export type ReactChild = ReactNode | boolean | void | null;

export type ReactChildren = ReactChild | Array<ReactChildren>;
