/* @flow */
/* eslint-disable import/prefer-default-export */

import { notEmpty } from '../../universal/utils/guards';

export function getEnvVar(envVarName : string) : string {
  const message =
    `The "${envVarName}" env variable was not found.  Please ensure you have ` +
    'set the environment variable. If you have but you are still seeing this ' +
    'error message then you may have forgotten to add the env variable to ' +
    'the "DefinePlugin" plugin within the webpack configFactory.';

  return notEmpty(process.env[envVarName], message);
}
