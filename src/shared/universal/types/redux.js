/* @flow */

import Axios from 'axios';
import type { Post } from './model';
import type { State } from '../reducers';

export type Action =
  | { type: 'FETCHING_POST', payload: number }
  | { type: 'FETCHED_POST', payload: Post };

export type ThunkLocals = {
  axios: typeof Axios
};

export type Dispatch<A: Action | ThunkAction> = (action: A) => A;

export type ThunkAction =
  (dispatch : Dispatch<Action>, getState : () => State, locals: ThunkLocals) => Promise<any>;
