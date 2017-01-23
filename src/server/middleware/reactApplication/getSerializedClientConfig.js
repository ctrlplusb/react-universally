/**
 * Generates a serliazed string representation of the config values that
 * are allowed to be exposed to the client.
 *
 * This should be bound to window.__CLIENT_CONFIG__ which will allow our
 * client executing code to access configuration values.
 *
 * As we generally have shared code between our node/browser code we have
 * created a helper function in "<projectroot>/shared/utils/config" that you
 * can used to request config values in a uniform fashion withour worrying
 * if the context is the browser or server.
 */

import serialize from 'serialize-javascript';
import config from '../../../../config';
import filterObject from '../../../shared/utils/objects/filterObject';

// Filter the config down to the properties that are allowed to be included
// in the HTML response.
const clientConfig = filterObject(
  config,
  // These are the rules used to filter the config.
  config.clientConfigFilter,
);

const serializedClientConfig = serialize(clientConfig);

export default () => serializedClientConfig;
