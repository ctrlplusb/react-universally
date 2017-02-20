import removeNil from '../arrays/removeNil';

/**
 * Deeply merges a given set of objects together.
 *
 * Objects to the right take priority.
 *
 * @param  {...Object} args - The objects to merge.
 *
 * @return {Object} - The merged object.
 */
export default function mergeDeep(...args) {
  const filtered = removeNil(args);
  if (filtered.length < 1) {
    return {};
  }
  if (filtered.length === 1) {
    return args[0];
  }
  return filtered.reduce((acc, cur) => {
    Object.keys(cur).forEach((key) => {
      if (typeof acc[key] === 'object' && typeof cur[key] === 'object') {
        // eslint-disable-next-line no-param-reassign
        acc[key] = mergeDeep(acc[key], cur[key]);
      } else {
        // eslint-disable-next-line no-param-reassign
        acc[key] = cur[key];
      }
    });
    return acc;
  }, {});
}
