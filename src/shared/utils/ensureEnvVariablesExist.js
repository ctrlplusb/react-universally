/* @flow */

import invariant from 'invariant';

function ensureEnvVariablesExist(expected : Array<string>) {
  expected.forEach(variable => {
    invariant(
      !!process.env[variable],
      `The "${variable}" env variable was not found.  Please ensure you have ` +
      'set the environment variable. If you have but you are still seeing this ' +
      'error message then you may have forgotten to add the env variable to ' +
      'the "DefinePlugin" plugin within the webpack configFactory.'
    );
  });
}

export default ensureEnvVariablesExist;
