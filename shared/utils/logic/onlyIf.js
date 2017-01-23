// :: (Boolean, () => Element) -> ?Any
export default function onlyIf(a, b) {
  return a ? b() : null;
}
