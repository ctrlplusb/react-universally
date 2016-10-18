// This originates from react-router-addons-routes, however, I have made a PR
// in order to allow the routes to support the "exactly" flag.  Until that PR
// is merged (https://github.com/ReactTraining/react-router-addons-routes/pull/10)
// we will need to use this local version.

import matchPattern from 'react-router/matchPattern';

const mergePatterns = (a, b) => (
  a[a.length - 1] === '/' && b[0] === '/' ?
    `${a.slice(0, a.length - 1)}${b}` :
    `${a}${b}`
);

const matchRoutesToLocation = (routes, location, matchedRoutes = [], params = {}, parentPattern = '') => {
  routes.forEach((route) => {
    const nestedPattern = mergePatterns(parentPattern, route.pattern);
    const match = matchPattern(nestedPattern, location);

    if (match) {
      if (route.exactly ? match.isExact : true) {
        matchedRoutes.push(route);
      }

      if (match.params) {
        Object.keys(match.params).forEach((key) => {
          params[key] = match.params[key]; // eslint-disable-line no-param-reassign
        });
      }

      if (route.routes) {
        matchRoutesToLocation(route.routes, location, matchedRoutes, params, nestedPattern);
      }
    }
  });

  return { matchedRoutes, params };
};

export default matchRoutesToLocation;
