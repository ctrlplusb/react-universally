import React from 'react';
import serialize from 'serialize-javascript';
import filterWithRules from '../../shared/utils/objects/filterWithRules';
import values from '../values';

// Filter the config down to the properties that are allowed to be included
// in the HTML response.
const clientConfig = filterWithRules(
  // These are the rules used to filter the config.
  values.clientConfigFilter,
  // The config values to filter.
  values,
);

const serializedClientConfig = serialize(clientConfig);

/**
 * A react component that generates a script tag that binds the allowed
 * values to the window so that config values can be read within the
 * browser.
 *
 * They get bound to window.__CLIENT_CONFIG__
 */
function ClientConfig({ nonce }) {
  return (
    <script
      type="text/javascript"
      nonce={nonce}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `window.__CLIENT_CONFIG__=${serializedClientConfig}`,
      }}
    />
  );
}

ClientConfig.propTypes = {
  nonce: React.PropTypes.string.isRequired,
};

export default ClientConfig;
