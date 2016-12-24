/* @flow */

function filterObjectLoop(obj : Object, filters : Object, basePropPath = '') : Object {
  return Object.keys(filters).reduce((acc, key) => {
    const propPath = basePropPath !== '' ? `${basePropPath}.${key}` : key;

    if (typeof filters[key] === 'object') {
      if (typeof obj[key] !== 'object') {
        throw new Error(`Expected prop at path "${propPath}" to be an object`);
      }
      acc[key] = filterObjectLoop(obj[key], filters[key], propPath); // eslint-disable-line no-param-reassign,max-len
    } else if (filters[key]) {
      if (typeof obj[key] === 'undefined') {
        throw new Error(`Filter set an "allow" on path "${propPath}", however, this path was not found on the source object.`);
      }
      acc[key] = obj[key]; // eslint-disable-line no-param-reassign
    }
    return acc;
  }, {});
}

// Applies a given set of filters to filter a given object's structure.
//
// The filters object should match the shape of the source object and should
// have a truthy/falsey value indicating if the property should be included/
// excluded.  If the filters do not contain a property that exists on the
// source object then the respective property will be excluded.
//
// Example:
//   filter(
//     // source
//     {
//       foo: { bar: 'bar', qux: 'qux' },
//       bob: 'bob',
//       poop: { plop: 'splash' }
//     },
//     // filters
//     {
//       foo: { bar: true },
//       poop: true
//     }
//   )
//
// Results in:
//   {
//     foo: { bar: 'bar' },
//     poop: { plop: 'splash' }
//   },
export default function filterObject(obj : Object, filters : Object) : Object {
  return filterObjectLoop(obj, filters);
}
