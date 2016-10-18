/* @flow */

import type { TaskRouteLocals } from '../types/react-router';
import * as PostActions from '../actions/posts';

/**
 * Creates the route tasks collection.  The routes follow the same structure
 * as defined within react-router-addons-routes.
 *
 * @see ./README.md
 *
 * Note: if your route tasks collection starts to get large consider using
 * a memoize function, such as the one available from lodash to avoid
 * unneccesary creation of the collection.
 */
function createTaskRoutes({ dispatch } : TaskRouteLocals) {
  return [
    {
      pattern: '/posts/:id',
      exactly: true,
      prefetchData: ({ id } : { id: number }) => dispatch(PostActions.fetch(id)),
      // defferedData: () => new Promise(resolve => setTimeout(resolve, 2000)),
    },
  ];
}

export default createTaskRoutes;
