import React, { Component, PropTypes } from 'react';

class Error404 extends Component {
  componentWillMount() {
    const { staticContext } = this.props;
    if (staticContext) {
      staticContext.missed = true;
    }
  }

  render() {
    return <div>Sorry, that page was not found.</div>;
  }
}

Error404.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  staticContext: PropTypes.object,
};

Error404.defaultProps = {
  staticContext: {},
};

export default Error404;
