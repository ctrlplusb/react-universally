<p align='center'>
  <h1 align='center'>React, Universally</h1>
  <p align='center'><img width='150' src='https://raw.githubusercontent.com/ctrlplusb/assets/master/logos/react-universally.png' /></p>
  <p align='center'>A starter kit giving you the minimum requirements for a production ready universal react application.</p>
</p>

## TOC

 - [About](https://github.com/ctrlplusb/react-universally#about)
 - [Features](https://github.com/ctrlplusb/react-universally#features)
 - [Overview](https://github.com/ctrlplusb/react-universally#overview)
 - [Project Configuration](https://github.com/ctrlplusb/react-universally#project-configuration)
 - [Environment Configuration](https://github.com/ctrlplusb/react-universally#environment-configuration)
 - [Express Server Security](https://github.com/ctrlplusb/react-universally#express-server-security)
 - [Progressive Web Application Ready](https://github.com/ctrlplusb/react-universally#progressive-web-application-ready)
 - [Extensions](https://github.com/ctrlplusb/react-universally#extensions)
 - [3rd Party Extensions](https://github.com/ctrlplusb/react-universally#3rd-party-extensions)
 - [Project Structure](https://github.com/ctrlplusb/react-universally#project-structure)
 - [Project Dependencies](https://github.com/ctrlplusb/react-universally#project-dependencies)
 - [Deploy your very own Server Side Rendering React App in 4 easy steps](https://github.com/ctrlplusb/react-universally#deploy-your-very-own-server-side-rendering-react-app-in-4-easy-steps)
 - [npm script commands](https://github.com/ctrlplusb/react-universally#npm-script-commands)

## About

This starter kit contains all the build tooling and configuration you need to kick off your next universal react project, whilst containing a minimal "project" set up allowing you to make your own architecture decisions (redux/mobx etc).

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
  - 🖌 Very basic CSS support - it's up to you to extend it with CSS Modules etc.
  - 🏜 Asset bundling support. e.g. images/fonts.
  - 🚀 Full ES2017+ support, use the exact same JS syntax across the entire project (src/tools/config).
  - 📦 All source bundled using `webpack` v2.
  - ✂️ Code splitting - `code-split-component` provides you declarative code splitting based on your routes.
  - 🍃 Tree-shaking, courtesy of `webpack`.
  - ✔️ Type checking via Flow, a beautiful and unobtrusive type framework.

      __NOTE:__ Flow is a completely optional feature.  The flow type annotations get ripped out of the source by the Webpack build step. You have no obligation to use flow within your code and can happily code without applying it to any new code.  I do highly recommend you try it out though. :)

      If you don't really don't want to use flow then you can run `npm run flow:remove`. This will make it as though flow never existed within the project.
  - 🎛 A development and optimised production configuration.
  - 🔧 Centralised project customisation and environment.
  - 👼 Airbnb's ESlint configuration.
  - ❤️ Preconfigured to deploy to `now` with a single command.

## Overview

Redux/MobX, data persistence, test frameworks, and all the other bells and whistles have been explicitly excluded from this boilerplate.  It's up to you to decide what technologies you would like to add to your own implementation based upon your own needs, this boilerplate simply serves as a clean base upon which to do so.

This boilerplate uses Webpack 2 to produce bundles for both the client and the
server.  `tools/webpack/configFactory.js` is used to generate the respective Webpack configuration for all our bundles. The factory is heavily commented to help you understand what is going on within the Webpack configuration.

We use babel across the entire project, which allows us to use the same level of javascript (e.g. es2015/2016/2017) without having to worry which level of the language within each separate slice of the project.  

Note: Given that we are bundling our server code I have included the `source-map-support` module to ensure that we still get nice stack traces when executing our code.

## Project Configuration

We have centralised the configuration of the project to be contained within the `./config` folder.  The files within this folder can be described as follows:

  - `environment.js` - parses and provides the environment specific values which will be used at runtime.  See the "Environment configuration" section below for more information.
  - `plugins.js` - provides useful plugin points into the internals of the project toolchain allowing you to easily manage/extend the Babel and Webpack configurations.
  - `project.js` - global project configuration options, with the capability to easily define new additional "node" target bundles (for e.g. an "apiServer").

In addition to having an easy "go to" location for configuration we hope that this centralised strategy will allow you to easily pull and merge any updates from the starter kit origin without having to pick apart configuration customisations you may have had to scatter throughout the tools folder.

## Environment Configuration

Environment specific configuration is support via standard environment variables (e.g. passed in via the CLI like `FOO=bar npm run start`) and/or by providing an "env" file.  

"env" files is an optional feature that is supported by the [`dotenv`](https://github.com/motdotla/dotenv) module. This module allows you to define files containing key/value pairs representing your required environment variables (e.g. `PORT=1337`). To use this feature create an `.env` file within the root of the project (we have provided an example file called `.env_example`, which contains all the environment variables this project currently relies on).

> Note: The `.env` file has been ignored from the git repository in anticipation that it will most likely be used to house development specific configuration.

We generally recommend that you don't persist any environment configuration values within the repository, and instead rely on your target host environments or deployment servers to provide the necessary values per environment.  However, if you would like to create and persist configs per environment you can create environment specific "env" files. To do so create a ".env" file that is postfix'ed with the environment you would like to define values for. For e.g. `.env.development` or `.env.staging` or `.env.production`

 > Note: if an environment specific configuration file exists, it will be used over the more generic `.env` file.

As stated before, the application has been configured to accept a mix-match of sources for the environment variables. i.e. you can provide some/all of the environment variables via the `.env` file, and others via the cli/host (e.g. `FOO=bar npm run build`). This gives you greater flexibility and grants you the opportunity to control the provision of sensitive values (e.g. db connection string).  Please do note that "env" file values will take preference over any values provided by the host/CLI.

## Express Server Security

We make use of the `helmet` and `hpp` middleware libraries to provide a fairly advanced security configuration for our express server, attempting to follow best practices. If you are unfamiliar with CSPs then I highly recommend that you do some reading on the subject:

  - https://content-security-policy.com/
  - https://developers.google.com/web/fundamentals/security/csp/
  - https://developer.mozilla.org/en/docs/Web/Security/CSP
  - https://helmetjs.github.io/docs/csp/

If you are relying on scripts/styles/assets from CDN or from any other server/application that is not hosted on the same URL as your application then you will need to explicitly add the respective CSN/Server URLs to the Content Security Policy within the express configuration.  For example you can see I have had to add the polyfill.io CDN in order to allow us to use the polyfill script.

You may find CSPs annoying at first, but it is a great habit to build. The CSP configuration is an optional item for helmet, however you should not remove it without making a serious consideration that you do not require the added security.

## Progressive Web Application Ready

We make use of the [`offline-plugin`](https://github.com/NekR/offline-plugin), providing you with a service worker to bridge that gap into a progressive web application that has aggressive caching and simple offline support.

## Extensions

We provide extensions to this project within branches. The stable branches are detailed below.

### [`redux`](https://github.com/ctrlplusb/react-universally/tree/redux)

Provides you with an example of how to integrate redux into this starter kit, as well as how to deal with issues such a prefetching of data for server rendering.

## 3rd Party Extensions

### [`advanced-boilerplate`](https://github.com/sebastian-software/advanced-boilerplate)

A This boilerplate provides extended features on top of `react-universally` such as CSS Support with CSS modules alongside a flexible full PostCSS chain for advanced transformations e.g. autoprefixer.

## Project Structure

```
/
|- config // Centralised project configuration
|  |- project      // Project configuration
|  |- environment  // Environment variable parsing/support
|  |- plugins      // Plugin points for tool internals
|
|- build // The target output dir for our build commands.
|  |- client // The built client module.
|  |- server // The built server module
|
|- src  // All the source code
|  |- server // The server bundle entry and specific source
|  |- client // The client bundle entry and specific source
|  |- shared // The shared code between the bundles)
|
|- tools
|  |- development // Tool for hot reloading development
|  |
|  |- webpack
|     |- configFactory.js  // Webpack configuration builder
|
|- .env_example // An example from which to create your own .env file.
```

I highly recommend putting most of your application code into the `shared` folder where possible.  Then put anything that is specific to the `server`/`client` within their respective folder.

## Project Dependencies

The dependencies within `package.json` are structured so that the libraries required to transpile/bundle the source are contained within the `devDependencies` section, whilst the libraries required during the server runtime are contained within the `dependencies` section.

If you perform build tasks on your production environment you must ensure that you have allowed the installation of the `devDependencies` too (Heroku, for example doesn't do this by default).

## Deploy your very own "React, Universally" App in 4 easy steps ##

__Step 1: Clone the repository.__

    git clone https://github.com/ctrlplusb/react-universally

__Step 2: `cd` into the cloned directory__

    cd react-universally

__Step 3: Install the awesome [`now`](https://zeit.co/now) CLI__

    npm install -g now

__Step 4: Deploy to "now"__

    npm run deploy

That's it.  Your clipboard will contain the address of the deployed app. Open your browser, paste, go.  These guys are seriously awesome hosts. [Check them out.](https://zeit.co/now)

## npm script commands##

### `npm run development`

Starts a development server for both the client and server bundles.  We use `react-hot-loader` v3 to power the hot reloading of the client bundle, whilst a filesystem watch is implemented to reload the server bundle when any changes have occurred.

### `npm run build`

Builds the client and server bundles, with the output being production optimised.

### `npm run start`

Executes the server.  It expects you to have already built the bundles either via the `npm run build` command or manually.

### `npm run clean`

Deletes any build output that would have originated from the other commands.

### `npm run deploy`

Deploys your application to [`now`](https://zeit.co/now). If you haven't heard of these guys, please check them out. They allow you to hit the ground running! I've included them within this repo as it requires almost zero configuration to allow your project to be deployed to their servers.

### `npm run lint`

Executes `eslint` (using the Airbnb config) against the src folder. Alternatively you could look to install the `eslint-loader` and integrate it into the `webpack` bundle process.

### `npm run analyze`

Creates an webpack-bundle-analyze session against the production build of the client bundle.  This is super handy for figuring out just exactly what dependencies are being included within your bundle.  Try clicking around, it's an awesome tool.

### `npm run flow`

Executes `flow-bin`, performing flow based type checking on the source.  If you really like flow I would recommend getting a plugin for your IDE.  For Atom I recommend `flow-ide`.

### `npm run flow:defs`

Installs the flow type definitions for the projects depenedencies from the official "flow-typed" repository.

### `npm run flow:report`

Executes `flow-coverage-report`, generating a report on your type check coverage.  It returns with an error if your coverage is below 80%.  After you have run it I recommend clicking into the generated flow-coverage directory and opening the HTML report.  You can click through into files to see where your coverage is lacking.

### `npm run flow:remove`

For those of us not wanting to use `flow`. Running this command removes everything `flow` related from the project.  It's best to run this against a fresh clone of the project, but it should work fine with a project that has been extended somewhat.

__Warning:__ This is a destructive behaviour - it modifies your actual source files. Please make sure you commit any existing changes to your src before running this command.


## Troubleshooting ##

___Q:___ __My project fails to build and execute when I deploy it to my host__

The likely issue in this case, is that your hosting provider doesn't install the `devDependencies` by default.  The dependencies within `package.json` are structured so that the libraries required to transpile/bundle the source are contained within the `devDependencies` section, whilst the libraries required during the server runtime are contained within the `dependencies` section.
You two options to fix this:

 1. Prebuild your project and then deploy it along with the build output.
 2. Change your host configuration so that it will install the `devDependencies` too.  In the case of Heroku for example see [here](https://devcenter.heroku.com/articles/nodejs-support#devdependencies).
