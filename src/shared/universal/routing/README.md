# Route Tasks

When doing SSR and your components require some external data (e.g. from an API endpoint), you really want to fetch the data first before trying to render the components so that the returned render from the SSR has the data already populated.  In order to do this we need some way of executing data fetching tasks on the server.

We are using react-router v4 in a "traditional" manner, with our components containing `Match` components that respond to the current location.  This is really nice, however, it is now difficult for us to attach our data loading needs to our components as we would have to be able to render our application first to know which `Match` components were fired, and subsequently which of our components were rendered.  This is further exasperated by the fact that some of our components may depend on some data having being fetched already, and could do early termination if the data exists.  Therefore we can't trust in doing a render and then interpreting the results to work out what data should be fetched.

To solve this I have come up with a simple solution I call "route tasks".  It makes use of the [`react-router-addons-routes`](https://github.com/ReactTraining/react-router-addons-routes) package, which provides a mechanism of defining a centralised [routes collection](https://github.com/ReactTraining/react-router-addons-routes#route-configuration-shape) as well as providing a `matchRoutesToLocation` function that allows us to determine which of these routes would be matched for a given location.

```js
import { matchRoutesToLocation } from 'react-router-addons-routes';

const routes = [
  { pattern: '/foo' },
  { pattern: '/bar' }
];

const { matchedRoutes } = matchRoutesToLocation(routes, { pathname: '/bar' });

console.log(matchedRoutes);
// [ { pattern: '/bar' }]
```

Using this mechanism we can define a set of routes, and instead of stating which component we would like the route to resolve to, we could instead specify a set of "tasks" that should be executed.

```js
import { matchRoutesToLocation } from 'react-router-addons-routes';

const routes = [
  { pattern: '/foo', doSomething: () => Promise.resolve('foo'); },
  { pattern: '/bar', doSomething: () => Promise.resolve('bar'); }
];

const { matchedRoutes } = matchRoutesToLocation(routes, { pathname: '/bar' });

matchedRoutes.forEach((route) => {
  if (route.doSomething) {
    route.doSomething()
  }
});
```

Within this project we are using this mechanism to define all of the routes which require data to be loaded.  We have preconfigured two different task types to help with this:

 - `prefetchData`: This is a task that should be executed _before_ we do any rendering on the server.
 - `deferredData`: This is a task that should be executed on the client for any matched routes.

All tasks have to return a `Promise`, which gives us the capability to know when the task has completed.

Using this we can then fire all our `prefetchData` tasks on the server, which in this project fires `redux-thunk` actions which return promises, and then wait for them to complete.  After they have completed we can safely assume all the data for any components that will be resolved on our application render will already have all their required data available to them.

Feel free to change the structure of the tasks, inventing your own as you please.  I have created a `runTasksForLocation` utility function that will allow you to execute any named tasks that you provide.  You could for example add a `logging` task.

___NOTE:___ YOU DO NOT HAVE TO DEFINE ROUTES WITHIN THE `taskRoutes` FILE TO MATCH ALL OF YOUR EXPECTED APPLICATION ROUTES. ONLY DEFINE ROUTES ON WHICH YOU HAVE DATA FETCH REQUIREMENTS FOR.
