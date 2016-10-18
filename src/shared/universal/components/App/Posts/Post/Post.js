/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import * as FromState from '../../../../reducers';
import type { Post as PostType } from '../../../../types/model';

type Props = {
  post: ?PostType,
};

function Post({ post } : Props) {
  if (!post) {
    // Post hasn't been fetched yet.
    return null;
  }

  const { title, body } = post;

  return post && (
    <div>
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
