/* @flow */
/* eslint-disable import/prefer-default-export */

import type { Dispatch, ThunkAction } from './redux';

export type Location = { pathname: string };

export type TaskRouteLocals = {
  dispatch: Dispatch<ThunkAction>,
};
