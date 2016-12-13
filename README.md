<p align='center'>
  <h1 align='center'>React, Universally</h1>
  <p align='center'><img width='150' src='https://raw.githubusercontent.com/ctrlplusb/assets/master/logos/react-universally.png' /></p>
  <p align='center'>A starter kit giving you the minimum requirements for a modern universal React application.</p>
</p>

## TOC

 - [About](https://github.com/ctrlplusb/react-universally#about)
 - [Features](https://github.com/ctrlplusb/react-universally#features)
 - [Overview](https://github.com/ctrlplusb/react-universally#overview)
 - [Project Configuration](https://github.com/ctrlplusb/react-universally#project-configuration)
 - [Environment Configuration](https://github.com/ctrlplusb/react-universally#environment-configuration)
 - [Express Server Security](https://github.com/ctrlplusb/react-universally#express-server-security)
 - [Offline Ready](https://github.com/ctrlplusb/react-universally#offline-ready)
 - [Extensions](https://github.com/ctrlplusb/react-universally#extensions)
 - [Project Structure](https://github.com/ctrlplusb/react-universally#project-structure)
 - [Project Dependencies](https://github.com/ctrlplusb/react-universally#project-dependencies)
 - [Deploy your very own Server Side Rendering React App in 4 easy steps](https://github.com/ctrlplusb/react-universally#deploy-your-very-own-server-side-rendering-react-app-in-4-easy-steps)
 - [npm script commands](https://github.com/ctrlplusb/react-universally#npm-script-commands)
 - [FAQs](https://github.com/ctrlplusb/react-universally#faqs)

## About

This starter kit contains all the build tooling and configuration you need to kick off your next universal React project, whilst containing a minimal "project" set up allowing you to make your own architecture decisions (Redux/MobX etc).

## Features

  - 🌍 Server side rendering.
  - ⚰ Offline support via a Service Worker.
  - 🐘 Long term browser caching of assets with automated cache invalidation.
  - 📦 All source is bundled using Webpack v2.
  - 🚀 Full ES2017+ support - use the exact same JS syntax across the entire project (src/tools/config). No more folder context switching!
  - 🔧 Centralised project configuration and environment settings.
  - 🔥 Extreme live development - hot reloading of ALL changes to client/server source, with auto development server restarts when your application configuration changes.  All this with a high level of error tolerance and verbose logging to the console.
  - ⛑ SEO friendly - `react-helmet` provides control of the page title/meta/styles/scripts from within your components.
  - 🤖 Optimised Webpack builds via HappyPack and an auto generated Vendor DLL for smooth development experiences.
  - ✂️ Code splitting - easily define code split points in your source using `code-split-component`.
  - 🍃 Tree-shaking, courtesy of Webpack.
  - 🚄 `express` server.
  - 👮 Security on the `express` server using `helmet` and `hpp`.
  - 👀 `react` as the view.
  - 🔀 `react-router` v4 as the router.
  - 🖌 Very basic CSS support - it's up to you to extend it with CSS Modules etc.
  - 🏜 Asset bundling support. e.g. images/fonts.
  - ✔️ Type checking via Flow, a beautiful and unobtrusive type framework.

      __NOTE:__ Flow is a completely optional feature.  The flow type annotations get ripped out of the source by the Webpack build step. You have no obligation to use flow within your code and can happily code without applying it to any new code.  I do highly recommend you try it out though. :)

      If you don't really don't want to use flow then you can run `npm run flow:remove`. This will make it as though flow never existed within the project.
  - 🎛 Preconfigured to support development and optimised production builds.
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

 - `private` - all configuration in here is considered "private"; i.e. don't bundle with the client.
    - `environment.js` - parses and provides the environment specific values which will be used at runtime.  See the "Environment configuration" section below for more information.
    - `plugins.js` - provides useful plugin points into the internals of the project toolchain allowing you to easily manage/extend the Babel and Webpack configurations.
    - `project.js` - global project configuration options, with the capability to easily define new additional "node" target bundles (for e.g. an "apiServer").
 - `public` - all configuration in here is safe to use anywhere; i.e. including client.
   - `htmlPage.js` - provides a centralised configuration for the html pages used by the server rendering process and the service worker (for offline support).

In addition to having an easy "go to" location for configuration we hope that this centralised strategy will allow you to easily pull and merge any updates from the starter kit origin without having to pick apart configuration customisations you may have had to scatter throughout the tools folder.

### Easily add an "API" bundle

A fairly common requirement for a project that scales is to create additional servers bundles, e.g. an API server.

Instead of requiring you to hack the Webpack configuration we have have provided a section within the centralised project configuration that allows you to easily declare additional bundles.  You simply need to provide the source, entry, and output paths - we take care of the rest.  

_IMPORTANT:_ One further requirement for this feature is that within your new server bundle you export the created http listener.  This exported listener will be used by the development server so that it can automatically restart your server any time the source files for it change.

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

## Offline Ready

We make use of the [`offline-plugin`](https://github.com/NekR/offline-plugin), providing you with a Service Worker configuration that supports offline rendering of your application.

## Extensions

We welcome extended versions in the form of repositories.  Please PR the link to yours for me to add it.

 - [`react-universally-redux`](https://github.com/ctrlplusb/react-universally-redux) - Adds Redux with simple custom data prefetching technique that works for the server and client.
 - [`react-universally-apollo`](https://github.com/ctrlplusb/react-universally-apollo) - Adds the Apollo Stack (i.e. Graphql).
 - [`react-universally-jest`](https://github.com/ctrlplusb/react-universally-jest) - Adds the Jest testing framework.

## Project Structure

```
/
|- config // Centralised project configuration.
|  |- public // insensitive information. i.e. safe for bundling in client.
|     |- htmlPage     // Customise meta tags for the online/offline html pages.
|  |- private  // Sensitive configuration. i.e. don't expose publicly.
|     |- project      // Project configuration.
|     |- environment  // Environment variable parsing/support.
|     |- plugins      // Plugin points for tool internals.
|
|- build // The target output dir for our build commands.
|  |- client // The built client module.
|  |- server // The built server module.
|
|- src  // All the source code.
|  |- server // The server bundle entry and specific source.
|  |- client // The client bundle entry and specific source.
|  |- shared // The shared code between the bundles.
|
|- tools
|  |- development // Development server.
|  |- webpack
|     |- configFactory.js  // Webpack configuration builder.
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

Creates an 'webpack-bundle-analyze' session against the production build of the client bundle.  This is super handy for figuring out just exactly what dependencies are being included within your bundle.  Try clicking around, it's an awesome tool.

### `npm run flow`

Executes `flow-bin`, performing flow based type checking on the source.  If you really like flow I would recommend getting a plugin for your IDE.  For Atom I recommend `flow-ide`.

### `npm run flow:defs`

Installs the flow type definitions for the projects dependencies from the official "flow-typed" repository.

### `npm run flow:report`

Executes `flow-coverage-report`, generating a report on your type check coverage.  It returns with an error if your coverage is below 80%.  After you have run it I recommend clicking into the generated flow-coverage directory and opening the HTML report.  You can click through into files to see where your coverage is lacking.

### `npm run flow:remove`

For those of us not wanting to use `flow`. Running this command removes everything `flow` related from the project.  It's best to run this against a fresh clone of the project, but it should work fine with a project that has been extended somewhat.

__Warning:__ This is a destructive behaviour - it modifies your actual source files. Please make sure you commit any existing changes to your src before running this command.


## FAQs ##

___Q:___ __After adding a module that contains SASS/CSS (e.g. material-ui or bootstrap) the hot development server fails__

The development server has been configured to automatically generate a "Vendor DLL" containing all the modules that are used in your source.  We do this so that any rebuilds by Webpack are optimised as it need not bundle all your project's dependencies every time.  This works great most of the time, however, if you introduce a module that depends on one of your Webpack loaders (e.g. CSS/Images) then you need to make sure that you add the respective module to the vendor DLL ignores list within your project configuration.

For example, say you added `bootstrap` and were referencing the CSS file like so in your client bundle:

```js
import 'bootstrap/dist/css/bootstrap.css';
```

You would then need to edit `./config/private/project.js` and make the following adjustment:

```js
export default {
  ...
  bundles: {
    client: {
      ...,
      devVendorDLL: {
        ...,
        ignores: ['bootstrap/dist/css/bootstrap.css']
      }  
    },
    ...
  }
  ...
}
```

This ensures that the respective import will be ignored when generating the development "Vendor DLL" which means it will get processed by Webpack and included successfully in your project.

___Q:___ __My project fails to build and execute when I deploy it to my host__

The likely issue in this case, is that your hosting provider doesn't install the `devDependencies` by default.  The dependencies within `package.json` are structured so that the libraries required to transpile/bundle the source are contained within the `devDependencies` section, whilst the libraries required during the server runtime are contained within the `dependencies` section.
You two options to fix this:

 1. Prebuild your project and then deploy it along with the build output.
 2. Change your host configuration so that it will install the `devDependencies` too.  In the case of Heroku for example see [here](https://devcenter.heroku.com/articles/nodejs-support#devdependencies).

___Q:___ __How do I keep my project up to date with changes/fixes made on `react-universally`?__

This project wants to be a base starter kit allowing you to mould it as you like for each of your project's needs.  This comes with the trade off that updates/fixes will be more "involved" to apply.

One example workflow is:

```bash
# First clone this repo
git clone https://github.com/ctrlplusb/react-universally my-project

# Go into your project
cd my-project

# Now rename the "origin" git remote to "upstream"
git remote rename origin upstream

# I would then recommend creating a hosted repository for your
# project (e.g. on github, or a free private on bitbucket)
# Then add your newly created repository as the "origin"
# remote like so: (for example, you need to put in the proper url)
git remote add origin ssh://git@bitbucket.org/Kimel1/my-project.git

# Then push the master branch content to the new "origin" remote
git push -u origin master

# You can now code/commit/push to origin as normal.
# If you want to at some stage get new changes from the
# react-universally project, then do something like this:

# First fetch the latest changes
git fetch upstream

# Then merge them into your project
git merge upstream/master

# You will have to deal with merge commits most likely
# I would get comfortable with a good merge tool. I use
# Atom Editor and they have a cool package called
# merge-conflicts which does the job okay.
# After you have completed the merge you can commit
# and continue
git commit
```
