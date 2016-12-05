import type { BuildOptions } from '../tools/types';

// This function is used to resolve the babel configuration for the
// client and server within development and production modes.
//
// Please use the provided values and then ensure that you return the
// appropriate values for each target and mode.
//
// We have decided to create this resolver strategy so that you can come to
// a centralised configuration folder to do most of your application
// configuration adjustments.  Additionally it helps to make merging
// from the origin starter kit a bit easier.
export default function babelConfigResolver(buildOptions : BuildOptions) {
  const { target, mode } = buildOptions;

  const babelConfig = {
    presets: [
      // JSX
      'react',
      // For our client bundles we transpile all the latest ratified
      // ES201X code into ES5, safe for browsers.  We exclude module
      // transilation as webpack takes care of this for us, doing
      // tree shaking in the process.
      target === 'client'
        ? ['latest', { es2015: { modules: false } }]
        : null,
      // For our server bundle we use the awesome babel-preset-env which
      // acts like babel-preset-latest in that it supports the latest
      // ratified ES201X syntax, however, it will only transpile what
      // is necessary for a target environment.  We have configured it
      // to target our current node version.  This is cool because
      // recent node versions have extensive support for ES201X syntax.
      // Also, we have disabled modules transpilation as webpack will
      // take care of that for us ensuring tree shaking takes place.
      // NOTE: Make sure you use the same node version for development
      // and production.
      target === 'server'
        ? ['env', { targets: { node: true }, modules: false }]
        : null,
    ].filter(x => x != null),
    plugins: [
      // Required to support react hot loader.
      mode === 'development'
        ? 'react-hot-loader/babel'
        : null,
      // We are adding the experimental "object rest spread" syntax as
      // it is super useful.  There is a caviat with the plugin that
      // requires us to include the destructuring plugin too.
      'transform-object-rest-spread',
      'transform-es2015-destructuring',
      // The class properties plugin is really useful for react components.
      'transform-class-properties',
      // This decorates our components with  __self prop to JSX elements,
      // which React will use to generate some runtime warnings.
      mode === 'development'
        ? 'transform-react-jsx-self'
        : null,
      // Adding this will give us the path to our components in the
      // react dev tools.
      mode === 'development'
        ? 'transform-react-jsx-source'
        : null,
      // The following plugin supports the code-split-component
      // instances, taking care of all the heavy boilerplate that we
      // would have had to do ourselves to get code splitting w/SSR
      // support working.
      // @see https://github.com/ctrlplusb/code-split-component
      [
        'code-split-component/babel',
        {
          // The code-split-component doesn't work nicely with hot
          // module reloading, which we use in our development builds,
          // so we will disable it (which ensures synchronously
          // behaviour on the CodeSplit instances).
          disabled: mode === 'development',
          // For our server bundle we will set the role as being 'server'
          // which will ensure that our code split components can be
          // resolved synchronously, being much more helpful for
          // pre-rendering.
          role: target,
        },
      ],
    ].filter(x => x != null),
  };

  console.log(JSON.stringify(babelConfig, null, 4));

  return babelConfig;
}
