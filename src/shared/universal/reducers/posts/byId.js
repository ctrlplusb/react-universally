/* @flow */

import type { Reducer } from 'redux';
import type { Action } from '../../types/redux';
import type { Post } from '../../types/model';

// -----------------------------------------------------------------------------
// EXPORTED REDUCER STATE TYPE

export type State = { [key: number]: Post };

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {};

// -----------------------------------------------------------------------------
// REDUCER

function byId(state: State = defaultState, action: Action) : State {
  if (action.type === 'FETCHED_POST') {
    return Object.assign({}, state,
      { [action.payload.id]: action.payload }
    );
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getById(state: State, id: number) : ?Post {
  return state[id];
}

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default (byId: Reducer<State, Action>);
