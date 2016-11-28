/* @flow */
/* eslint-disable import/prefer-default-export */

export function notEmpty<T>(x: ?T, message?: string) : T {
  if (x == null) {
    throw new Error(message || 'Expected value to not be empty.');
  }

  return x;
}
