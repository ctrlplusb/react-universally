/**
 * A react component that generates a script tag that binds the allowed
 * values to the window for use within the browser.
 *
 * They get bound to window.__CLIENT_CONFIG__
 *
 * When you use the "<projectroot>/config/get" helper it automatically resolves
 * the config values for you from either the window or the local values.js
 * file.
 */

import React from 'react';
import serialize from 'serialize-javascript';
import filterWithRules from '../shared/utils/objects/filterWithRules';
import values from './values';

// Filter the config down to the properties that are allowed to be included
// in the HTML response.
const clientConfig = filterWithRules(
  // These are the rules used to filter the config.
  values.clientConfigFilter,
  // The config values to filter.
  values,
);

const serializedClientConfig = serialize(clientConfig);

function ClientConfigScript({ nonce }) {
  const props = {
    type: 'text/javascript',
    nonce,
    dangerouslySetInnerHTML: {
      __html: `window.__CLIENT_CONFIG__=${serializedClientConfig}`,
    },
  };
  if (nonce) {
    props.nonce = nonce;
  }
  return <script {...props} />;
}

ClientConfigScript.propTypes = {
  nonce: React.PropTypes.string,
};

ClientConfigScript.defaultProps = {
  nonce: 'NONCE_PLACEHOLDER',
};

export default ClientConfigScript;
