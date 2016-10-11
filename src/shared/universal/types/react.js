/* @flow */

// Note: we already have the definitions from
// https://github.com/facebook/flow/blob/master/lib/react.js
// so the below are merely helpful extensions.

import React from 'react';

export type $React$Element = React.Element<*>;

export type $React$Node = string | number | $React$Element | Array<$React$Element>;

export type $React$Child = $React$Node | boolean | void | null;

export type $React$Children = $React$Child | Array<$React$Children>;
