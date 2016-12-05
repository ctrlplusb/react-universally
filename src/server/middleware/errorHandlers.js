/* @flow */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import type { Middleware, $Request, $Response, NextFunction } from 'express';

const errorHandlersMiddleware = [
  // Handle 404 errors.
  // Note: the react application middleware hands 404 paths, but it is good to
  // have this backup for paths not handled by the universal middleware. For
  // example you may bind a /api path to express.
  function notFoundMiddlware(req: $Request, res: $Response, next: NextFunction) {
    res.status(404).send('Sorry, that resource was not found.');
  },

  // Handle all unhandled errors.
  // Typically you want to return a "500" response status.
  // Note: You must provide specify all 4 parameters on this callback function
  // even if they aren't used, otherwise it won't be used.
  function unhandledErrorMiddleware(
    err: ?Error, req: $Request, res: $Response, next: NextFunction) {
    if (err) {
      console.log(err);
      console.log(err.stack);
    }
    res.status(500).send('Sorry, an unexpected error occurred.');
  },
];

export default (errorHandlersMiddleware : Array<Middleware>);
