const CPU_COUNT = require('os').cpus().length;
const HappyPack = require('happypack');

// This determines how many threads a HappyPack instance can spin up.
// See the plugins section of the webpack configuration for more.
const happyPackThreadPool = HappyPack.ThreadPool({ // eslint-disable-line new-cap
  size: CPU_COUNT >= 4
    ? Math.round(CPU_COUNT / 2)
    : 2,
});

// Generates a HappyPack plugin.
// @see https://github.com/amireh/happypack/
function happyPackPlugin({ name, loaders }) {
  return new HappyPack({
    id: name,
    verbose: false,
    threadPool: happyPackThreadPool,
    loaders,
  });
}

// :: [Any] -> [Any]
function removeEmpty(x) {
  return x.filter(y => !!y);
}

// :: bool -> (Any, Any) -> Any
function ifElse(condition) {
  return (then, or) => (condition ? then : or);
}

// :: ...Object -> Object
function merge() {
  const funcArgs = Array.prototype.slice.call(arguments); // eslint-disable-line prefer-rest-params

  return Object.assign.apply(
    null,
    removeEmpty([{}].concat(funcArgs))
  );
}

module.exports = {
  removeEmpty,
  ifElse,
  merge,
  happyPackPlugin,
};
