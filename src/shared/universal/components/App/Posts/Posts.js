/* @flow */

import React from 'react';
import { Link, Match } from 'react-router';
import Post from './Post';

function Posts() {
  return (
    <div>
      <h1>Posts</h1>

      <ul>
        <li><Link to="/posts/1">Post 1</Link></li>
        <li><Link to="/posts/2">Post 2</Link></li>
      </ul>

      <Match pattern="/posts/:id" component={Post} />
    </div>
  );
}

export default Posts;
