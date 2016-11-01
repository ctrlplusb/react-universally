<p align='center'>
  <h1 align='center'>React, Universally</h1>
  <p align='center'><img width='150' src='https://raw.githubusercontent.com/ctrlplusb/assets/master/logos/react-universally.png' /></p>
  <p align='center'>A starter kit giving you the minimum requirements for a production ready universal react application.</p>
</p>

## TOC

 - [About](https://github.com/ctrlplusb/react-universally#about)
 - [Features](https://github.com/ctrlplusb/react-universally#features)
 - [Overview](https://github.com/ctrlplusb/react-universally#overview)
 - [Application Configuration](https://github.com/ctrlplusb/react-universally#application-configuration)
 - [Express Server Security](https://github.com/ctrlplusb/react-universally#express-server-security)
 - [Progressive Web Application Ready](https://github.com/ctrlplusb/react-universally#progressive-web-application-ready)
 - [Extensions](https://github.com/ctrlplusb/react-universally#extensions)
 - [3rd Party Extensions](https://github.com/ctrlplusb/react-universally#3rd-party-extensions)
 - [Project Structure](https://github.com/ctrlplusb/react-universally#project-structure)
 - [Project Dependencies](https://github.com/ctrlplusb/react-universally#project-dependencies)
 - [Server Runtime Dependencies](https://github.com/ctrlplusb/react-universally#server-runtime-dependencies)
 - [Deploy your very own Server Side Rendering React App in 5 easy steps](https://github.com/ctrlplusb/react-universally#deploy-your-very-own-server-side-rendering-react-app-in-5-easy-steps)
 - [npm script commands](https://github.com/ctrlplusb/react-universally#npm-script-commands)
 - [References](https://github.com/ctrlplusb/react-universally#references)

## About

This starter kit contains all the build tooling and configuration you need to kick off your next universal react project, whilst containing a minimal "project" set up allowing you to make your own architecture decisions (redux/mobx etc).

> __NEW!__ If you really want an example of a data library integration along with an example of how to go about solving data prefetching for the server then feel free to take a look at the [`redux`](https://github.com/ctrlplusb/react-universally/tree/redux) branch which provides exactly this.

## Features

  - 🌍 Server side rendering.
  - 🐘 Long term caching of assets.
  - ⚰ Offline support.
  - 🔥 Extreme live development - hot reloading of client/server source, with high level of error tolerance, alongside a HappyPack and Vendor DLL (courtesy of @strues).
  - 🚄 `express` server.
  - 👮 Security on the `express` server using `helmet` and `hpp`.
  - 👀 `react` as the view.
  - 🔀 `react-router` v4 as the router.
  - ⛑ `react-helmet` allowing control of the page title/meta/styles/scripts from within your components. Direct control for your SEO needs.
  - 🖌 Very basic CSS support - it's up to you to extend it into CSS Modules, SASS, PostCSS, Aphrodite etc.
  - 🏜 Image and Font support.
  - 🚀 Full ES2017+ support, using `babel` to transpile where needed.
  - 📦 Bundling of both client and server using `webpack` v2.
  - ✂️ Code splitting - `code-split-component` provides you declarative code splitting based on your routes.
  - 🍃 Tree-shaking, supported by `webpack`.
  - ✔️ Type checking via Flow, a beautiful and unobtrusive type framework.

      __NOTE:__ Flow is a completely optional feature.  The flow type annotations get ripped out of the source by the webpack build step. You have no obligation to use flow within your code and can even uninstall the dependency (flow-bin) without breaking the project.  I do highly recommend you try it out though.

      If you don't want the types you can run `npm run flow:remove` to remove them from the src.  You'll just need to clean up a few empty lines thereafter.
  - 🎛 A development and optimized production configuration.
  - 🔧 Easy environment configuration via cli/host env vars and/or a [`dotenv`](https://github.com/motdotla/dotenv) file.
  - 👼 Airbnb's eslint configuration.
  - ❤️ Preconfigured to deploy to `now` with a single command.

## Overview

Redux/MobX, data persistence, test frameworks, and all the other bells and whistles have been explicitly excluded from this boilerplate.  It's up to you to decide what technologies you would like to add to your own implementation based upon your own needs, this boilerplate simply serves as a clean base upon which to do so.

> __NEW!__ If you really want an example of a data library integration along with an example of how to go about solving data prefetching for the server then feel free to take a look at the [`redux`](https://github.com/ctrlplusb/react-universally/tree/redux) branch which provides exactly this.

This boilerplate uses Webpack 2 to produce bundles for both the client, the
server, and the middleware that the server will use to support SSR rendering of the React application.  You will notice the following Webpack configuration files:

   - `tools/webpack/client.config.js`
   - `tools/webpack/server.config.js`
   - `tools/webpack/universalMiddleware.config.js`

All of these call into the `tools/webpack/configFactory.js` in order to generate their respective webpack configurations. I've tried to keep the webpack configuration as centralized as possible to allow easier reuse of the configuration and allow you to not have to do constant file jumping whilst trying to analyse the configuration for a target bundle.  I've also included a fair amount of comments as I know webpack can be a bit daunting at first.

Using webpack and babel across all of our source allows us to use the same level of javascript (e.g. es2015/2016/2017) without having to worry about what each target environment supports.  In addition to this it allows our client/server code to both support the additional file types that a typical React application may import (e.g. CSS/Images).

Given that we are bundling our server code I have included the `source-map-support` module to ensure that we still get nice stack traces when executing our code.

## Application Configuration

The application is configured via environment variables (e.g. `process.env.FOO_BAR`).

You can provide the environment variables using standard means (e.g `FOO_BAR=baz npm run build`), or by creating a `.env` file within your application root.  The `.env` file is supported by the [`dotenv`](https://github.com/motdotla/dotenv) module. Within this file you can provide key/value pairs representing your required environment variables (e.g. `PORT=1337`).  This can save you a lot of effort in having to provide a large amount of environment variables to your application.

It's important to note that we have explicitly ignored the `.env` from the git repository, with the expectation that you would manually/automatically create a `.env` that is specific to each environment you compile/execute the application within (e.g. dev/ci/production).

The application has been configured to accept a mix-match of sources for the environment variables. i.e. you can provide some environment variables via the `.env` file, and others via the cli/host (e.g. `FOO=bar npm run build`). This gives you greater flexibility and grants you the opportunity to control the provision of sensitive values (e.g. db connection string).

To get you started quickly we have provided a `.env_example` file that contains all the environment variables this project currently relies on.  Copy this file (e.g. `cp .env_example .env`) and then you should be able to run any of the other npm scripts.

___IMPORTANT!___

To allow for sourcing the environment variables from multiple sources the build scripts go through a process of merging the environment vars into a single collection. In order to ensure that nothing unexpected gets passed into the build/deploy process you MUST list any expected environment variable identifiers within the `.env_whitelist` file (which lives at the root of the project).  Please make sure that you keep this file up to date with any new environment variables that you expect to consume.  I know this may seem like a bit more effort, but I feel the security around this is worth it.

___IMPORTANT!___

Our webpack configuration interprets the environment variables and then "inline replaces" any "process.env.XXX" environment variable reference with it's associated value.  This means that these environment variables are only needed during compile time, not run time.  Therefore it's possible to only provide the environment variables for the build commands, and then when you execute the compiled output you need not provide any environment variables.

If you do find cases where you would prefer an environment variable to be provided at run time rather than compiled into your source then don't add the respective environment variable identifier to the `.env_whitelist` file.  You will have to make sure that you provide the respective environment variable in run time then (e.g. `FOO_BAR=baz npm run start`).

## Express Server Security

We make use of the `helmet` and `hpp` middleware libraries to provide a fairly advanced security configuration for our express server, attempting to follow best practices. If you are unfamiliar with CSPs then I highly recommend that you do some reading on the subject:

  - https://content-security-policy.com/
  - https://developers.google.com/web/fundamentals/security/csp/
  - https://developer.mozilla.org/en/docs/Web/Security/CSP
  - https://helmetjs.github.io/docs/csp/

If you are relying on scripts/styles/assets from CDN or from any other server/application that is not hosted on the same URL as your application then you will need to explicitly add the respective CSN/Server URLs to the Content Security Policy within the express configuration.  For example you can see I have had to add the polyfill.io CDN in order to allow us to use the polyfill script.

You may find CSPs annoying at first, but it is a great habit to build. The CSP configuration is an optional item for helmet, however you should not remove it without making a serious consideration that you do not require the added security.

## Progressive Web Application Ready

We make use of the [`sw-precache-webpack-plugin`](https://github.com/goldhand/sw-precache-webpack-plugin), providing you with a service worker to bridge that gap into a progressive web application that has aggressive caching and offline support.

## Extensions

We provide extensions to this project within branches, detailed below.

### [`redux`](https://github.com/ctrlplusb/react-universally/tree/redux)

Provides you with an example of how to integrate redux into this starter kit, as well as how to deal with issues such a prefetching of data for server rendering.

### [`preact`](https://github.com/ctrlplusb/react-universally/tree/preact) __Coming Soon__

Does size matter to you?.  This branch replaces the React libs with `preact` and `preact-compat`.  Use the same React APIs but gain a minimum of 37kb shavings off your gzip bundle size.

## 3rd Party Extensions

### [`advanced-boilerplate`](https://github.com/sebastian-software/advanced-boilerplate)

A This boilerplate provides extended features on top of `react-universally` such as CSS Support with CSS modules alongside a flexible full PostCSS chain for advanced transformations e.g. autoprefixer.

## Project Structure

```
/
|- build // The target output dir for our build commands.
|  |- client // The built client module.
|  |- server // The built server module
|
|- src  // All the source code
|  |- server // The server bundle entry and specific source
|  |- universalMiddleware // the universal middleware bundle entry and specific source
|  |- client // The client bundle entry and specific source
|  |- shared // The shared code between the bundles
|     |- universal // Shared code that is suitable for any of the bundles
|     |- node      // Shared code that is suitable for the node bundles
|                     (i.e. the server or universalMiddleware bundles)
|- tools
|  |- development // Tool for hot reloading development
|  |
|  |- webpack
|     |- client.config.js // Client webpack configuration
|     |- server.config.js // Server webpack configuration
|     |- universalMiddleware.config.js // Universal middleware webpack configuration
|     |- configFactory.js  // Webpack configuration builder
|
|- .env_example // An example from which to create your own .env file.
```

I highly recommend putting most of your application code into the `shared` folders where possible.  Then put anything that is specific to the `server`/`client`/`universalMiddleware` within their respective folder.

## Project Dependencies

The dependencies within `package.json` are structured so that the libraries required to transpile/bundle the source are contained within the `devDependencies` section, whilst the libraries required during the server runtime are contained within the `dependencies` section.

If you do building on your production environment you must ensure that you have allowed the installation of the `devDependencies` too (Heroku, for example doesn't do this by default).

## Server Runtime Dependencies

Even though we are using webpack to support our universal application we keep the webpack runtime out of our production runtime environment.  Everything is prebundled in prep for production execution.  Therefore we only have the following runtime dependencies:

  - `node` v6
  - `app-root-path` - Gives us the ability to easily resolve files from the root of our app.
  - `compression` - Gzip compression support for express server responses.
  - `express` - Web server.
  - `helmet` - Provides a content security policy for express.
  - `hpp` - Express middleware to protect against HTTP Parameter Pollution attacks.
  - `react` - A declarative, efficient, and flexible JavaScript library for building user interfaces.
  - `react-dom` - React support for the DOM.
  - `react-helmet` - Control the page header from your components.
  - `react-router` - A complete routing library for React.
  - `serialize-javascript` - Allows us to serialize our js in a format safe for embedding in webpages.
  - `source-map-support` - Adds source map support to node.js (for stack traces).

## Deploy your very own "React, Universally" App in 5 easy steps ##

__Step 1: Clone the repository.__

    git clone https://github.com/ctrlplusb/react-universally

__Step 2: `cd` into the cloned directory__

    cd react-universally

__Step 3: Set up your env configuration file__

The application depends on environment settings, which can be provided via the cli/host or via a `.env` file.  You can copy the example version (`.env_example`) provided to ensure that all the required environment variables are available. To do so run the following command:

    cp .env_example .env

I would recommend that you review the options within the `.env` file.

__Step 4: Install the awesome [`now`](https://zeit.co/now) CLI__

    npm install -g now

__Step 5: Deploy to "now"__

    npm run deploy

That's it.  Your clipboard will contain the address of the deployed app. Open your browser, paste, go.  These guys are seriously awesome hosts. [Check them out.](https://zeit.co/now)

## npm script commands##

### `npm run development`

Starts a development server for both the client and server bundles.  We use `react-hot-loader` v3 to power the hot reloading of the client bundle, whilst a filesystem watch is implemented to reload the server bundle when any changes have occurred.

### `npm run build`

Builds the client and server bundles, with the output being production optimized.

### `npm run start`

Executes the server.  It expects you to have already built the bundles either via the `npm run build` command or manually.

### `npm run clean`

Deletes any build output that would have originated from the other commands.

### `npm run deploy`

Deploys your application to [`now`](https://zeit.co/now). If you haven't heard of these guys, please check them out. They allow you to hit the ground running! I've included them within this repo as it requires almost zero configuration to allow your project to be deployed to their servers.

### `npm run lint`

Executes `eslint` (using the Airbnb config) against the src folder. Alternatively you could look to install the `eslint-loader` and integrate it into the `webpack` bundle process.

### `npm run flow`

Executes `flow-bin`, performing flow based type checking on the source.  If you really like flow I would recommend getting a plugin for your IDE.  For Atom I recommend `flow-ide`.

### `npm run flow:defs`

Installs the flow type definitions for the projects depenedencies from the official "flow-typed" repository.

### `npm run flow:report`

Executes `flow-coverage-report`, generating a report on your type check coverage.  It returns with an error if your coverage is below 80%.  After you have run it I recommend clicking into the generated flow-coverage directory and opening the HTML report.  You can click through into files to see where your coverage is lacking.

### `npm run flow:remove`

For those of us not wanting to use `flow`. Running this command removes all `flow` types from the src.

__Warning:__ This is a destructive behavior - it modifies your actual source files. Please make sure you commit any existing changes to your src before running this command.


## Troubleshooting ##

___Q:___ __My project fails to build and execute when I deploy it to my host__

The likely issue in this case, is that your hosting provider doesn't install the `devDependencies` by default.  The dependencies within `package.json` are structured so that the libraries required to transpile/bundle the source are contained within the `devDependencies` section, whilst the libraries required during the server runtime are contained within the `dependencies` section.
You two options to fix this:

 1. Prebuild your project and then deploy it along with the build output.
 2. Change your host configuration so that it will install the `devDependencies` too.  In the case of Heroku for example see [here](https://devcenter.heroku.com/articles/nodejs-support#devdependencies).

___Q:___ __My server bundle fails to execute after installing a new library.__

This may occur if the library you added contains a file format that depends on one of your webpack loaders to process it (e.g. `react-toolbox` contains sass/css).  For these cases you need to ensure that you add the file types to the whitelist of the `externals` section in the `webpackConfigFactory`.  For example:

```
// Anything listed in externals will not be included in our bundle.
externals: removeEmpty([
  // We don't want our node_modules to be bundled with our server package,
  // prefering them to be resolved via native node module system.  Therefore
  // we use the `webpack-node-externals` library to help us generate an
  // externals config that will ignore all node_modules.
  ifServer(nodeExternals({
    // NOTE: !!!
    // However the node_modules may contain files that will rely on our
    // webpack loaders in order to be used/resolved, for example CSS or
    // SASS. For these cases please make sure that the file extensions
    // are added to the below list. We have added the most common formats.
    whitelist: [
      /\.(eot|woff|woff2|ttf|otf)$/,
      /\.(svg|png|jpg|jpeg|gif)$/,
      /\.(mp4|mp3|ogg|swf|webp)$/,
      /\.(css|scss|sass|sss|less)$/,
    ],
  })),
]),
```

As you can see above we have already added the most common formats, so you are unlikely to hit this issue, however, it is good to be aware of.

__Q:__ __I get checksum warning errors after receiving content from a server rendered request__

I have experienced some cases of this myself.  The below stackoverflow post talks about a strange case where you are required to surround the server rendered content with an additional `div`.  At the moment this boilerplate doesn't seem to require it, but I have extended versions of this boilerplate where all of a sudden I had to do this.  It is worth knowing about.

[Here is the post.](http://stackoverflow.com/questions/33521047/warning-react-attempted-to-reuse-markup-in-a-container-but-the-checksum-was-inv)

## References ##

  - __Webpack 2__ - https://gist.github.com/sokra/27b24881210b56bbaff7
  - __React Hot Loader v3__ - https://github.com/gaearon/react-hot-boilerplate/pull/61
  - __dotenv__ - https://github.com/bkeepers/dotenv
