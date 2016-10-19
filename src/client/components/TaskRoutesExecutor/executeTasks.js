/* @flow */

import type { Location } from '../../../shared/universal/types/react-router';
import type { Dispatch, ThunkAction } from '../../../shared/universal/types/redux';
import runTasksForLocation from '../../../shared/universal/routing/runTasksForLocation';

function executeTasks(location: Location, dispatch: Dispatch<ThunkAction>) {
  const tasksToExecute = window && window.APP_STATE
    // We have an APP_STATE available, which will contain the state from the
    // server populated by any 'prefetchData' tasks, therefore we only need to
    // call the 'defferedData' tasks.
    ? ['defferedData']
    // No data is available so we will execute both the 'prefetchData' and
    // 'defferedData' tasks.
    : ['prefetchData', 'defferedData'];

  if (window) {
    // We now remove the APP_STATE as it has been safely merged into the redux
    // store at this stage, and by deleting it we can make sure that we will
    // execute both the 'prefetchData' and 'defferedData' tasks for every route
    // change that happens on the client side.
    delete window.APP_STATE;
  }

  // The location has changed so we will attempt to run any route tasks
  // that are matched for the new location.
  const executingTasks = runTasksForLocation(
    location,
    tasksToExecute,
    { dispatch }
  );

  if (executingTasks) {
    // Tasks are being executed...
    executingTasks.then(({ routes }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Finished route tasks', routes); // eslint-disable-line no-console,max-len
      }
    });
  }
}

export default executeTasks;
