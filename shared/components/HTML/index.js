/* eslint-disable react/no-danger */

import React, { PropTypes } from 'react';

/**
 * The is the HTML shell for our React Application.
 */
function HTML(props) {
  const {
    htmlAttributes,
    headerElements,
    bodyElements,
    appBodyString,
  } = props;

  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    (
      <html {...htmlAttributes}>
        <head>
          {headerElements}
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: appBodyString }} />
          {bodyElements}
        </body>
      </html>
    )
  );
}

HTML.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  htmlAttributes: PropTypes.object,
  headerElements: PropTypes.node,
  bodyElements: PropTypes.node,
  appBodyString: PropTypes.string,
};

HTML.defaultProps = {
  htmlAttributes: null,
  headerElements: null,
  bodyElements: null,
  appBodyString: '',
};

// EXPORT

export default HTML;
