/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */

// Okay, bear with me on this one...
//
// We don't want our universalMiddleware to be bundled along with our server
// code, which webpack will try to do by default if you require a module in
// source that is being bundled.  Our universalMiddleware is bundled seperately
// which gives us a lot of stability when doing hot development reloads of
// changes to our server or universalMiddleware bundles, therfore we definitely
// dont' want it bundled with our server.  Our server needs to resolve the
// universalMiddleware module at runtime.
//
// To do this we make use of the  "externals" configuration option within our
// webpack config. We have added some regex's that will match the require
// statements below.  This indicates to webpack that the code should not be
// included in the bundle, but rather the require statement should be left
// as is and resolved at runtime.
//
// We always bundle the server code (for development and production) and then
// execute it. This means that the server code will live out the standard
// build output directory of {projectroot}/build/server
//
// So when the server code does get executed it is going to be executed from
// its try and resolve the respective require statement relative to it's current
// directory.
//
// This means that you should write the require statements below in a relative
// fashion to the {projectroot}/build/server directory.
//
// For our production builds we want to import the bundled/built
// universalMiddleware bundle. This is normally output at
// {projectroot}/build/universalMiddleware which is just one level up from
// where the server bundle lives.
//
// For our development builds we want to instead import the universalDevMiddleware
// wrapper which is located at {projectroot}/tools/development/universalMiddleware.
// To get to this location we have to go two levels up from the
// {projectroot}/build/server directory in order to resolve into the tools
// directory and finally the universalDevMiddleware.
//
// Note: for development we import the universalDevMiddleware instead of the
// standard universalMiddleware bundle to avoid issues with not being able to
// flush our node require cache, which would prevent any hot updates to our
// middleware in development mode.

let tempUniversalMiddleware;

if (process.env.NODE_ENV === 'development') {
  // In development mode we will use a special wrapper middleware which will
  // allow us to flush our node module cache effectively, and it will thereby
  // allow us to "hot" reload any updates to our universalMiddleware bundle.

  tempUniversalMiddleware =
    // This require should be relative to {projectroot}/build/server
    require('../../tools/development/universalDevMiddleware');
} else {
  // In production we will just import our universal middleware directly.
  // Our server bundle will be flattened and in "build/server", therfore to import
  // the middleware we do a relative path to "../universalMiddleware" which
  // exists in "build/universalMiddleware".

  tempUniversalMiddleware =
    // This require should be relative to {projectroot}/build/server
    require('../universalMiddleware').default;
}

// eslint complains if you export a "let", so we will mount our middleware
// onto a "const"
const universalMiddleware = tempUniversalMiddleware;

export default universalMiddleware;
