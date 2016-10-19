/* @flow */

import matchRoutesToLocation from './temp/matchRoutesToLocation';
// import matchRoutesToLocation from 'react-router-addons-routes/matchRoutesToLocation';

import taskRoutes from './taskRoutes';
import type { Location, TaskRouteLocals } from '../types/react-router';

type TaskExecutionResult = {
  routes: Array<Object>,
  results: Array<any>,
};

/**
 * When you execute the tasks using "runTasksForLocation" please be aware
 * that multiple tasks could be executed. All the resolved tasks are executed
 * via the Promise.all API.
 *
 *
 *
 *    meaning that the results resolved
 * from the promise will be an array with each indice being the result for
 * one of the tasks that were executed.
 *
 * Therefore in your tasks you may want to return a data structure that will
 * allow you to easily know the type of data that was being returned.
 *
 * @example
 *
 *  const routeTasks = [
 *    {
 *      pattern: '/foo',
 *      prefetchData: () =>
 *        axios.get('http://foo').then(data => ({ type: 'foo', data }))
 *    }
 *  ];
 *
 *  const executingTasks = runTasksForLocation(location, 'prefetchData');
 *
 *  if (executingTasks) {
 *    executingTasks
 *      // We get the results for the executingTasks promise
 *     .then(results =>
 *        results
 *          // We filter them down to the 'foo' data type.
 *          .filter(result => result && result.type && result.type === 'foo')
 *          // And print the data out to the console.
 *          .forEach(result => console.log('Foo data:', result.data))
 *     );
 *  }
 */
function runTasksForLocation(
  location: Location,
  taskNames: Array<string>,
  locals: TaskRouteLocals,
  ) : ?Promise<TaskExecutionResult> {
  const routes = taskRoutes(locals);

  // Now we try to match the location being requested against our taskRoutes
  // and see if there are any matches.
  const { matchedRoutes, params } = matchRoutesToLocation(
    routes, location
  );

  if (matchedRoutes.length === 0) {
    return undefined;
  }

  const resolveTasks = taskName => Promise.all(
    // The list of action routes which were matched.
    matchedRoutes
    // Filter the action routes down to those the action.
    .filter(tasksRoute => tasksRoute[taskName])
    // Then we call the 'prefetchData' action, passing in any routing params.
    // The action should typically return a Promise so that you are able to
    // indicate when the action has completed.
    .map(tasksRoute => tasksRoute[taskName](params))
  );

  return Promise.all(taskNames.map(resolveTasks))
    .then(results => ({ routes: matchedRoutes, results }));
}

export default runTasksForLocation;
