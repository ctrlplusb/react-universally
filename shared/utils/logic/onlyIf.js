// :: (Boolean, X|() => X) -> ?X
/**
 * Returns "value" if and only if "condition" is a truthy value.
 *
 * If "value" is a function, the function will be executed in order to resolve
 * the final "value".  This provides a lazy value resolving mechanism.
 *
 * @param  {Any} condition - truthy/falsey
 * @param  {Any|Function} value - a function that results in a value, or a value
 *
 * @return {Any|null} - The resolved value or null if the condition was falsey.
 */
export default function onlyIf(condition, value) {
  // eslint-disable-next-line no-nested-ternary
  return condition
    ? (typeof value === 'function' ? value() : value)
    : null;
}
