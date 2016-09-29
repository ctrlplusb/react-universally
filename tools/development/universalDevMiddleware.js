/* eslint-disable global-require */

// We have to use this wrapper for our universalMiddleware in development mode
// as webpack uses it's own require system, where we would like to be able to
// flush out the standard node require cache any time changes occur to our
// universalMiddleware bundle.
const universalDevMiddleware = (req, resp) => {
  const wrappedMiddleware = require('../../build/universalMiddleware/index.js').default;

  wrappedMiddleware(req, resp);
};

module.exports = universalDevMiddleware;
