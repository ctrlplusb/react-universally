/* eslint-disable no-unused-vars */

import { readFile } from 'fs';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';

import config from '../../config';

/**
 * Middleware to intercept calls to our offline page to ensure that
 * inline scripts get a nonce value attached to them.
 */
export default function offlinePageMiddleware(req, res, next) {
  // We should have had a nonce provided to us.  See the server/index.js for
  // more information on what this is.
  if (typeof res.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = res.locals.nonce;

  readFile(
    // Path to the offline page.
    pathResolve(
      appRootDir.get(),
      config('bundles.client.outputPath'),
      config('serviceWorker.offlinePageFileName'),
    ),
    // Charset for read
    'utf-8',
    // Read handler
    (err, data) => {
      if (err) {
        res.status(500).send('Error returning offline page.');
        return;
      }
      // We replace the placeholder with the actual nonce.
      const offlinePageWithNonce = data.replace(
        'OFFLINE_PAGE_NONCE_PLACEHOLDER',
        nonce,
      );
      // Send back the page as the response
      res.send(offlinePageWithNonce);
    },
  );
}
