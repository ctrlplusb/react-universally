function filterWithRulesLoop(rules, obj, basePropPath = '') {
  return Object.keys(rules).reduce((acc, key) => {
    const propPath = basePropPath !== '' ? `${basePropPath}.${key}` : key;

    if (typeof rules[key] === 'object') {
      if (typeof obj[key] !== 'object') {
        throw new Error(`Expected prop at path "${propPath}" to be an object`);
      }
      acc[key] = filterWithRulesLoop(rules[key], obj[key], propPath); // eslint-disable-line no-param-reassign,max-len
    } else if (rules[key]) {
      if (typeof obj[key] === 'undefined') {
        throw new Error(`Filter set an "allow" on path "${propPath}", however, this path was not found on the source object.`);
      }
      acc[key] = obj[key]; // eslint-disable-line no-param-reassign
    }
    return acc;
  }, {});
}

/**
 * Applies a rules object to filter a given object's structure.
 *
 * The rules object should match the shape of the source object and should
 * have a truthy/falsey value indicating if a property should be included/
 * excluded.  If the filters do not contain a property that exists on the
 * source object then the respective property will be excluded.
 *
 * @param  {Object} rules : The filter rules.
 * @param  {Object} obj   : The object to filter.
 *
 * @return {Object}
 *   The filtered object.
 *
 * @example
 *   filter(
 *     // rules
 *     {
 *       foo: { bar: true },
 *       poop: true
 *     },
 *     // source
 *     {
 *       foo: { bar: 'bar', qux: 'qux' },
 *       bob: 'bob',
 *       poop: { plop: 'splash' }
 *     },
 *   )
 */
export default function filterWithRules(rules, obj) {
  return filterWithRulesLoop(rules, obj);
}
