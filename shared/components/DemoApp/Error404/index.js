import React, { Component, PropTypes } from 'react';

class Error404 extends Component {
  componentWillMount() {
    const { staticContext } = this.context.router;
    if (staticContext) {
      staticContext.missed = true;
    }
  }

  render() {
    return (
      <div>Sorry, that page was not found.</div>
    );
  }
}

Error404.contextTypes = {
  router: PropTypes.shape({
    staticContext: PropTypes.object,
  }).isRequired,
};

export default Error404;
