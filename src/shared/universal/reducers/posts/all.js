/* @flow */

import type { Reducer } from 'redux';
import type { Action } from '../../types/redux';

// -----------------------------------------------------------------------------
// EXPORTED REDUCER STATE TYPE

export type State = Array<number>;

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = [];

// -----------------------------------------------------------------------------
// REDUCER

function all(state: State = defaultState, action: Action) : State {
  if (action.type === 'FETCHED_POST') {
    const post = action.payload;
    return state.find(x => post.id === x)
      ? state
      : [...state, action.payload.id];
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getAll(state: State) : Array<number> {
  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default (all: Reducer<State, Action>);
