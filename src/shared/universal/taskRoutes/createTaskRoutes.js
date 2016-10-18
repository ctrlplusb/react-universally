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
function createTaskRoutes(locals) {
  return [
    {
      pattern: '/',
      exactly: true,
      prefetchData: () => new Promise(resolve => setTimeout(resolve, 5000)),
    },
    {
      pattern: '/about',
      exactly: true,
      defferedData: () => new Promise(resolve => setTimeout(resolve, 2000)),
    },

    // EXAMPLE 1: Make an api call.
    // ----------------------------
    // Note: I am using axios (https://github.com/mzabriskie/axios), a promise
    // based HTTP library for this example.
    /*
    {
      pattern: '/product/:productId',
      prefetchData: ({ productId }) => // productId will be passed within a params obj.
        axios.get(`http://foobar.com/api/products/${productId}`)
    }
    */

    // Example 2: Call a redux-thunk action.
    // -------------------------------------
    // @see https://github.com/gaearon/redux-thunk
    // Note: You must ensure that your redux-thunk return a Promise for them to
    // work nicely with this technique.
    // Additionally, when you call 'fireRouteTasks' you will need to pass in
    // a "locals" object containing the redux dispatch function.
    /*
    {
      pattern: '/product/:productId',
      prefetchData: ({ productId }) => locals.dispatch(fetchProduct(productId))
    }
    */
  ];
}

export default createTaskRoutes;
