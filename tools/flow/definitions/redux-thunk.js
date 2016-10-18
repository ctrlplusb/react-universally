// @see https://github.com/gcanti/pantarei/blob/master/redux-thunk/v2.js

import type { MiddlewareAPI, Dispatch } from 'redux'

declare module 'redux-thunk' {
  declare type ThunkMiddleware = <S, A>(api: MiddlewareAPI<S, A>) =>
    (next: Dispatch<A>) => Dispatch<A>;

  // declare var withExtraArgument = (extraArgs: Object) => ThunkMiddleware

  declare module.exports: ThunkMiddleware;
}
