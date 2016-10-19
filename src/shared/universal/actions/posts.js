/* @flow */
/* eslint-disable import/prefer-default-export */

import type { Post } from '../types/model';
import type { Action, ThunkAction } from '../types/redux';

function fetching(id: number) : Action {
  return { type: 'FETCHING_POST', payload: id };
}

function fetched(post: Post) : Action {
  return { type: 'FETCHED_POST', payload: post };
}

export function fetch(id: number) : ThunkAction {
  return (dispatch, getState, { axios }) => {
    fetching(id);

    return axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(({ data }) => dispatch(fetched(data)));
  };
}
