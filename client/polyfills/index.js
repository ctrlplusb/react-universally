/* eslint-disable no-console */

import Modernizr from 'modernizr';

// This is just an illustrative example.  Here you are testing the client's
// support for the "picture" element, and if it isn't supported then you
// load a polyfill.
if (!Modernizr.picture) {
  console.log('Client does not support "picture", polyfilling it...');
  // If you want to use the below do a `yarn add picturefill --exact` and then
  // uncomment the lines below:
  /*
  require('picturefill');
  require('picturefill/dist/plugins/mutation/pf.mutation');
  */
} else {
  console.log('Client has support for "picture".');
}
