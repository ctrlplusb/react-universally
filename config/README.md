# Application configuration

This folder contains our centralised application configuration.  

Just about everything that should be reasonably configurable will be contained within here.  It even contains plugin function definitions that allow you to extend/modify the Babel and Webpack configurations.

The goals of our application configuration are:

  - __Easy to use__
  - __Centralised__
  - __Secure__
  - __Allows for configuration to be provided at build and execution time__

## Background

Below are some of the problems that we faced, and how we ended up with our current implementation...

As this is a universal application you are mostly creating code that is shared between your "client" and "server" bundles. The "client" is sent across the wire to be executed in user's browsers therefore you have to be extra careful in what you include in the bundle.  Webpack by default bundles all code together if it is imported within your source. Therefore if you were to import the application configuration within a module that will be included in the "client" bundle, the entire application configuration would be included with your "client" bundle. This is extremely risky as the configuration exposes the internal structure of your application and may contain sensitive data such as database connection strings.

One possible solution to the above would be to use Webpack's `DefinePlugin` in order to statically inject/replace only the required configuration values into our client bundle.  However,  this solution fails to address our desire to be able to expose execution time provided values (e.g. `FOO=bar npm run start`) to our client bundle. These environment variables can only be interpreted at runtime, therefore we decided on a strategy of making the server be responsible for attaching a configuration object to `window.__CLIENT_CONFIG__` within the HTML response.  This would then allow us to ensure that environment variables could be properly exposed.  This works well, however, it introduces a new problem:  As most of our code is in the "shared" folder you are forced to put in boilerplate code that will read the application configuration from either the `window.__CLIENT_CONFIG__` or the "config" file depending on which bundle is being built (i.e. "client" or "server").  This isn't a trivial process and is easy to get wrong.

So now we had two problems to deal with:
  1. Prevent the accidental import of the configuration object into client bundles.
  2. Provide an abstraction to the boilerplate in order to read configuration values in shared source code.

### Problem 1: Guarding import of the config object into client bundles.

Because we now state that our application configuration for client bundles should be a filtered object that is bound to the "window.__CLIENT_CONFIG__" within the HTTP response this problem became quite trivial to solve.  Within our `./config` file we simply put a guarded check that uses the `process.env.IS_CLIENT` flag that is provided by the Webpack `DefinePlugin`.  This boolean flag indicates whether Webpack is bundling a "client" bundle or not.  So if this flag is `true` we throw an error stating that this is a dangerous move.  This is a build time error.

### Problem 2: Abstracting access to either `window.__CLIENT_CONFIG__` or `./config`

For this we created a helper function get `safeConfigGet`.  It is located in `./src/shared/utils/config`.  You can use it like so:

```js
import { safeConfigGet } from '../shared/utils/config';

export function MyComponent() {
  return <h1>{safeConfigGet(['welcomeMessage'])}</h1>;
}
```

You must use this helper function any time you need to access configuration within the "shared" src folder.  We also recommend that you use it within any "client" source too (you could just use the `window.__CLIENT_CONFIG__` object in this case, but it is nice to keep the config access as familiar as possible throughout your source).

This does all the abstraction required, and will make sure that "problem 1" detailed above isn't hit either.

## Details

Okay, we hope that the background and overview above has given you a bigger insight into why our configuration is structured as it is.  Below we will go through some of the details.

### Providing/Managing configuration

ALL configuration should be added/managed to the `./config/index.js` file.  We even recommend that you attach environment read variables as properties to this configuration file in order to provide a familiar read API throughout your source.

### Managing the configuration for client bundles (`window.__CLIENT_CONFIG__`)

Within the bottom of the `./config/index.js` you will see that a `clientConfig` value gets exported.  This configuration value is created by providing a set of rules/filters that detail which of the configuration values you deem safe/required for inclusion in your client bundles.  Please go to this section of the configuration file for more detail on how this filtering mechanism works.

This `clientConfig` export is then serialised and attached to the `window.__CLIENT_CONFIG__` by the `reactApplication` middleware.

### "server"/"tools" - Reading Configuration Values

Within the server or build tools it is safe to just import and use the configuration file directly.

```js
import config from '../../config';

// ... code bootstrapping an express instance ...

app.listen(config.port, () => console.log('Server started.'));
```

If you are using `flow` you will get helpful assertions and type checking against your use of the config values.  You'll also get autocomplete on the config values if you are using an IDE/plugin that supports flow (for Atom editor I recommend [`flow-ide`](https://github.com/steelbrain/flow-ide)).

As stated in the background section above you must not import and use the config file in this manner within your "shared" source, however, don't worry about it as you will get a build time error if you accidentally did so.  The error will also include details on the proper API that you should use for the "shared" source.

### "client"/"shared" - Reading Configuration Values

You can't import the `./config` file in the "client" or "shared" source as this will cause build failures.  The configuration object will be bound to `window.__CLIENT_CONFIG__` as detailed in the background section above.  Therefore to access the configuration within these cases we recommend the use of our provided helper located in `./src/shared/utils/config`.

```js
import { safeConfigGet } from '../shared/utils/config';

export function MyComponent() {
  return <h1>{safeConfigGet(['welcomeMessage'])}</h1>;
}
```

The `window.__CLIENT_CONFIG__` will have the same structure as the original `./config`, however, it will only contain a subset of it (i.e. only the values you deemed safe for inclusion within the client).  

Our `safeConfigGet` allows you to specify nested path structures in the form of an array.  Say for example you wanted to access a configuration in a similar manner to the following:

```js
import config from '../../config';

console.log(config.serviceWorker.enabled);
```

You can't use the above in the "shared" or "client" code, you have to use our `safeConfigGet` helper.  You would access the same value like so:

```js
import { safeConfigGet } from '../shared/utils/config';

console.log(safeConfigGet(['serviceWorker', 'enabled']));
```

You don't have `flow` to help you in these cases as you are providing a array of strings and not access the config object directly, so typos can be a common issue.  In addition to this you may not have exposed the target configuration value via the client config filter rules that are contained at the bottom of the `./config` file.

To help you with these cases the `safeConfigGet` will throw helpful error messages indicating the problem and recommending solutions to them.
