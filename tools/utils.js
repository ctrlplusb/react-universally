import HappyPack from 'happypack';
import notifier from 'node-notifier';
import colors from 'colors/safe';
import { execSync } from 'child_process';
import appRootDir from 'app-root-dir';


// Generates a HappyPack plugin.
// @see https://github.com/amireh/happypack/
export function happyPackPlugin({ name, loaders }) {
  return new HappyPack({
    id: name,
    verbose: false,
    threads: 5,
    loaders,
  });
}

// Removes the empty items from the given array.
export function removeEmpty(x) {
  return x.filter(y => y != null);
}

// This is a higher order function that accepts a boolean condition and will
// return a function allowing you to provide if/else values that should be
// resolved based on the boolean condition.
//
// That sounds complicated, but it isn't really.  See the examples below. :)
//
// For example, say that we have a "isDev" boolean flag had a value of `true`,
// and we would like to create a webpack loader based on this value being true.
// Then when we used this function like so:
//   const ifDev = ifElse(isDev);
//   ifDev('foo');  // => 'foo'
//
// You can also set an "else" value. In the below case the "isDev" flag is false.
//   const ifDev = ifElse(isDev);
//   ifDev('foo', 'bar');  // => 'bar'
//
// The "else" value is optional, in which case a null value would be returned.
//
// This is really handy for doing inline value resolution within or webpack
// configuration.  Then we simply use one of our other utility functions (e.g.
// removeEmpty) to remove all the nulls from our objects/arrays.
//
// As an additional feature: if you pass a function as the "then"/"or" value
// then this function will only be interpretted after the ifElse has run. This
// can be handy for values that require some complex initialization process.
// e.g. ifDev(() => 'lazy', 'not lazy');
export function ifElse(condition) {
  // TODO: Allow the then/or to accept a function for lazy value resolving.
  return function ifElseResolver(then, or) {
    const execIfFuc = x => (typeof x === 'function' ? x() : x);
    return condition ? execIfFuc(then) : (or);
  };
}

// Merges a set of objects together.
// NOTE: This performs a deep merge.
export function merge(...args) {
  const filtered = removeEmpty(args);
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
        acc[key] = merge(acc[key], cur[key]);
      } else {
        // eslint-disable-next-line no-param-reassign
        acc[key] = cur[key];
      }
    });
    return acc;
  }, {});
}


export function log(options) {
  const title = `${options.title.toUpperCase()}`;

  if (options.notify) {
    notifier.notify({
      title,
      message: options.message,
    });
  }

  const level = options.level || 'info';
  const msg = `==> ${title} -> ${options.message}`;

  switch (level) {
    case 'warn': console.log(colors.yellow(msg)); break;
    case 'error': console.log(colors.bgRed.white(msg)); break;
    case 'info':
    default: console.log(colors.green(msg));
  }
}

export function exec(command) {
  execSync(command, { stdio: 'inherit', cwd: appRootDir.get() });
}
