/* @flow */
/* eslint-disable global-require */

let tempUniversalMiddleware;

if (process.env.NODE_ENV === 'development') {
  // In development mode we will use a special wrapper middleware which will
  // allow us to flush our node module cache effectively, and it will thereby
  // allow us to "hot" reload any updates to our universalMiddleware bundle.
  tempUniversalMiddleware = require('../../../tools/development/universalDevMiddleware');
} else {
  // In production we will just import our universal middleware directly.
  // It will always be at this relative path, when in the src or build
  // directories.
  tempUniversalMiddleware = require('../../universalMiddleware').default;
}

const universalMiddleware = tempUniversalMiddleware;

export default universalMiddleware;
