/* @flow */

import HappyPack from 'happypack';
import notifier from 'node-notifier';
import colors from 'colors/safe';
import { execSync } from 'child_process';
import appRootDir from 'app-root-dir';

type HappyPackLoaderConfig = {
  path: string,
  query?: Object,
};

type HappyPackConfig = {
  name: string,
  loaders: Array<string|HappyPackLoaderConfig>,
};

// Generates a HappyPack plugin.
// @see https://github.com/amireh/happypack/
export function happyPackPlugin({ name, loaders } : HappyPackConfig) {
  return new HappyPack({
    id: name,
    verbose: false,
    threads: 5,
    loaders,
  });
}

export function removeEmpty(x : Array<any>) : Array<any> {
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
export function ifElse(condition : boolean) {
  // TODO: Allow the then/or to accept a function for lazy value resolving.
  return function ifElseResolver<X, Y>(then : X, or : Y) : X|Y {
    const execIfFuc = x => (typeof x === 'function' ? x() : x);
    return condition ? execIfFuc(then) : (or);
  };
}

// Merges a set of objects together.
// NOTE: This performs a deep merge.
export function merge(...args : Array<?Object>) {
  const filtered : Array<Object> = removeEmpty(args);
  if (filtered.length < 1) {
    return {};
  }
  if (filtered.length === 1) {
    return args[0];
  }
  return filtered.reduce((acc, cur) => {
    Object.keys(cur).forEach((key) => {
      if (typeof acc[key] === 'object' && typeof cur[key] === 'object') {
        acc[key] = merge(acc[key], cur[key]); // eslint-disable-line no-param-reassign
      } else {
        acc[key] = cur[key]; // eslint-disable-line no-param-reassign
      }
    });
    return acc;
  }, {});
}

type NotificationOptions = {
  title: string,
  message: string,
  notify?: boolean,
  level?: 'info'|'warn'|'error'
};

export function log(options : NotificationOptions) {
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
    case 'warn': console.log(colors.red(msg)); break;
    case 'error': console.log(colors.bgRed.white(msg)); break;
    case 'info':
    default: console.log(colors.green(msg));
  }
}

export function exec(command : string) {
  execSync(command, { stdio: 'inherit', cwd: appRootDir.get() });
}
