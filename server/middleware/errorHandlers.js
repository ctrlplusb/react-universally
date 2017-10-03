/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const prettyError = require('pretty-error').start();

// Configure prettyError to simplify the stack trace:

// skip events.js and http.js and similar core node files
prettyError.skipNodeFiles();

// skip all the trace lines about express` core and sub-modules
prettyError.skipPackage('express');

const errorHandlersMiddleware = [
  /**
   * 404 errors middleware.
   *
   * NOTE: the react application middleware hands 404 paths, but it is good to
   * have this backup for paths not handled by the react middleware. For
   * example you may bind a /api path to express.
   */
  function notFoundMiddlware(req, res, next) {
    res.status(404).send('Sorry, that resource was not found.');
  },

  /**
   * 500 errors middleware.
   *
   * NOTE: You must provide specify all 4 parameters on this callback function
   * even if they aren't used, otherwise it won't be used.
   */
  function unexpectedErrorMiddleware(err, req, res, next) {
    if (err) {
      console.log(prettyError.render(err));
    }
    res.status(500).send('Sorry, an unexpected error occurred.');
  },
];

export default errorHandlersMiddleware;
