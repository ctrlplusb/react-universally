// :: Array<?A> -> Array<A>
export default function removeNil(as) {
  return as.filter(a => a != null);
}
