// :: (Boolean, X|() => X) -> ?X
export default function onlyIf(a, b) {
  // eslint-disable-next-line no-nested-ternary
  return a
    ? (typeof b === 'function' ? b() : b)
    : null;
}
