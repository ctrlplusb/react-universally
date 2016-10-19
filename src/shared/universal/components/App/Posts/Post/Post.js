/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as FromState from '../../../../reducers';
import type { Post as PostType } from '../../../../types/model';

type Props = {
  post: ?PostType,
};

function Post({ post } : Props) {
  if (!post) {
    // Post hasn't been fetched yet. It would be better if we had a "status"
    // reducer attached to our posts which gave us a bit more insight, such
    // as whether the post is currently being fetched, or if the fetch failed.
    return null;
  }

  const { title, body } = post;

  return (
    <div>
      <Helmet title={`Posts - ${title}`} />

      <h1>{title}</h1>
      <div>
        {body}
      </div>
      <div>
        Foo
      </div>
    </div>
  );
}

function mapStateToProps(state, { params: { id } }) {
  return {
    post: FromState.getPostById(state, id),
  };
}

export default connect(mapStateToProps)(Post);
