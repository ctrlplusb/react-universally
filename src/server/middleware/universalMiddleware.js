/* eslint-disable global-require */

let tempUniversalMiddleware;

if (process.env.NODE_ENV === 'development') {
  // In development mode we will use a special wrapper middleware which will
  // allow us to flush our node module cache effectively, and it will thereby
  // allow us to "hot" reload any updates to our universalMiddleware bundle.
  tempUniversalMiddleware = require('../../../tools/development/universalDevMiddleware');
} else {
  // In production we will just import our universal middleware directly.
  // Our server bundle will be flattened and in "build/server", therfore to import
  // the middleware we do a relative path to "../universalMiddleware" which
  // exists in "build/universalMiddleware".

  tempUniversalMiddleware = require('../universalMiddleware').default; // eslint-disable-line
}

const universalMiddleware = tempUniversalMiddleware;

export default universalMiddleware;
