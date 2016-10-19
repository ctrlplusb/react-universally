/* @flow */

import { combineReducers } from 'redux';
import type { Reducer } from 'redux';
import type { Action } from '../../types/redux';

import all, * as FromAll from './all';
import type { State as AllState } from './all';

import byId, * as FromById from './byId';
import type { State as ByIdState } from './byId';

// -----------------------------------------------------------------------------
// EXPORTED REDUCER STATE TYPE

export type State = {
  all: AllState,
  byId: ByIdState
};

// -----------------------------------------------------------------------------
// REDUCER

const posts : Reducer<State, Action> = combineReducers({
  all,
  byId,
});

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getById(state: State, id: number) {
  return FromById.getById(state.byId, id);
}

export function getAll(state : State) {
  return FromAll
    .getAll(state.all)
    .map(id => getById(state, id));
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default posts;
