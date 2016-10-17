/* @flow */

const actionRoutes = [
  // EXAMPLE 1: Make an api call.
  /*
  {
    path: '/product/:productId',
    // Note: you need to polyfill "fetch" to use it.
    // e.g. https://github.com/matthew-andrews/isomorphic-fetch
    // "fetch" returns a promise.
    // Then within the rendering of the universal middleware the Promise.all
    // that is called on our action routes will contain the results from
    // below. Be aware though that as multiple routes could be matched and that
    // we are using Promise.all, each prefetchData result will be contained
    // within an array.  You may want to consider having an intermediate "then"
    // on each prefetchData result which will massage the data and store it
    // into a format that will allow you to know from where the data originated.
    // e.g. ({ productId }) =>
    //    fetch(`http://foobar.com/api/products/${productId}`)
    //      .then(data => ({ type: 'product', data })
    prefetchData: ({ productId }) => fetch(`http://foobar.com/api/products/${productId}`)
  }
  */

  // Example 2: Call a redux-thunk action
  // @see https://github.com/gaearon/redux-thunk
  /*
  {
    path: '/product/:productId',
    // Note: redux-thunk returns a promise, which is perfect for our use case,
    // as we need a promise to know when the action has completed. Then within
    // rendering within the universal middleware we can fetch the redux state
    // and pass it as the initial state to our render function.
    prefetchData: ({ productId }) => fetchProduct(productId)
  }
  */
];

export default actionRoutes;
