/* @flow */
/* eslint-disable import/prefer-default-export */

import fs from 'fs';

export function fileExists(filePath : string, message : string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(message);
  }
}
