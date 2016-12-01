/* @flow */

import HappyPack from 'happypack';
import notifier from 'node-notifier';
import colors from 'colors';
import { execSync } from 'child_process';
import appRootDir from 'app-root-dir';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

const appRootPath = appRootDir.get();

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
  // TODO: Try out the thread pool again since we upgraded to v3
  return new HappyPack({
    id: name,
    verbose: false,
    threads: 4,
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
export function ifElse(condition : boolean) {
  // TODO: Allow the then/or to accept a function for lazy value resolving.
  return function ifElseResolver<X, Y>(then : X, or : Y) : X|Y {
    return condition ? then : or;
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
  open?: string,
  level?: 'info'|'warn'|'error'
};

export function createNotification(options : NotificationOptions) {
  const title = `${options.title.toUpperCase()}`;

  notifier.notify({
    title,
    message: options.message,
    open: options.open,
  });

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
  // $FlowFixMe
  execSync(command, { stdio: 'inherit', cwd: appRootPath });
}

export function getFilename(filePath : string) {
  return path.relative(path.dirname(filePath), filePath);
}

export function ensureNotInClientBundle() {
  if (process.env.IS_CLIENT) {
    throw new Error(
      'You are importing the application configuration into the client bundle! This is super dangerous as you will essentially be exposing all your internals/logins/etc to the world.  If you need some configuration that will be consumed by the client bundle then add it to the clientSafe configuration file.',
    );
  }
}

// This exists so that we can support the recieving of environment variables
// from multiple sources. i.e.
//  - standard environment variables
//  - a '.env' file, supported by  https://github.com/motdotla/dotenv
//
//  If a .env file exists, the contents of it will read and then it will be
//  merged over the standard environment variables object, otherwise the
//  standard environment variables object (process.env) will be used.
//
//  This gives us a nice degree of flexibility in deciding where we would
//  like our environment variables to be loaded from, which can be especially
//  useful for environment variables that we consider sensitive.
export function getEnvVars() {
  const envFile = path.resolve(appRootPath, './.env');

  return fs.existsSync(envFile)
    // We have a .env file, which we need to merge with the standard vars.
    ? Object.assign(
      {},
      // Merge the standard "process.env" environment variables object.
      process.env,
      // With the items from our ".env" file
      dotenv.parse(fs.readFileSync(envFile, 'utf8')),
    )
    // No .env file, so we will just use standard vars.
    : process.env;
}
