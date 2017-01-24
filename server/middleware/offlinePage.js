/* eslint-disable no-unused-vars */

import { readFile } from 'fs';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import getConfig from '../../config/get';

/**
 * We need a middleware to intercept calls to our offline page to ensure that
 * inline scripts get the correct nonce value injected into them.  Otherwise
 * we can't provide client config values to the offline page.
 */
export default function offlinePageMiddleware(req, res, next) {
  // We should have had a nonce provided to us.  See the server/index.js for
  // more information on what this is.
  if (typeof res.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = res.locals.nonce;
  readFile(
    pathResolve(
      appRootDir.get(),
      getConfig('bundles.client.outputPath'),
      getConfig('serviceWorker.offlinePageFileName'),
    ),
    'utf-8',
    (err, data) => {
      if (err) {
        res.status(500).send('Error returning offline page.');
        return;
      }
      const withNonce = data.replace('NONCE_PLACEHOLDER', nonce);
      res.send(withNonce);
    },
  );
}
