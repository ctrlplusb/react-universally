# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

NOTE: This isn't a traditional library style project for which semantic versioning makes sense, it's a project that you clone and extend to your own desire.  Therefore I am not using semantic version in a strict manner, but rather to indicate the level of changes that have occurred.

I'll map them as follows:
  - Major: Large application structure / technology changes. E.g. moving from react-router v2 to v4.
  - Minor: New features or changes to the build tools. Could contain some things that are traditionally know as breaking changes, however, I believe the upgrade path to minor.
  - Patch: Small(ish) fixes/restructuring that I expect will take minimal effort to merge in.

# [13.0.0] - 2017-01-23

### BREAKING

 - Big folder structure refactor, moving items from src/* into the root of the project.
 - Removes the CONF_ENV variable and instead relies on NODE_ENV for runtime env specification on executing server.
 - Upgrades to `react-router` v4 beta.
 - Replaces `code-split-component` with `react-async-component`
 - Removed `react-hot-loader` as it doesn't play nicely with `react-async-component`, but we still have webpack's default hot module reloading.
 - Complete restructure of the DefinePlugin special flags, they have been prefixed with "BUILD_FLAG_" to make them more obvious when used in the code. This also helps us distinguish these build-time values from other runtime provided process.env values.
 - We no longer rely on NODE_ENV to include an optimized version of React/ReactDOM - this caused confusion with booting an application to target a specific NODE_ENV like "staging" or whatever. Now we use webpack's alias feature to resolve React/ReactDOM imports to the correct optimized version of React.
 - Removes cross-env and refactors the script commands.  You can assign NODE_ENV as and when you need now (for example, to target a .env.production environment configuration file).
 - Renamed environment variables:
   - `SERVER_PORT` to `PORT`
   - `SERVER_HOST` to `HOST`
   - `CLIENT_DEVSERVER_PORT` to `CLIENT_DEV_PORT`
 - Renames the `nodeBundlesIncludeNodeModuleFileTypes` config property to `nodeExternalsFileTypeWhitelist`
 - Refactors the server and serviceworker offline page generation. We now use a set of React components (`ServerHTML` and `HTML`) to manage our HTML in a uniform fashion.
 - Refactors how we resolve environment specific configuration values. `NODE_ENV` is reserved for specifying a `development` or `production` build now. Use `CONF_ENV` to specify a target environment if you would like to resolve an environment specific .env file.
 - All config reads are now done through the centralised `config/index.js` helper.
 - Refactors the client configuration filter rule to be contained within the main configuration and moves the configuration object creation into the server middleware.
 - Refactors the config folder in various ways.  Cleaning up, restructuring, etc.
 - Renames the `environmentVars` file and helpers.

### Changed

 - All server/client/shared code all use the shared config helper.
 - Updated dependencies, including to the latest Webpack official 2 release.

### Added

 - New babel plugins to optimise React production build performance.
 - Adds new icon sets.

### Fixed

 - Chrome favicon request issue.
 - Cleans up the package scripts.
 - Service worker would fail if a subfolder was added to the public folder.

# [12.0.0] - 2017-01-09

### BREAKING

 - Removed `flow` - it is now in a feature branch.
 - Simplified the Vendor DLL config.  It uses a single "includes" prop only now.
 - Moves the source-maps-support into the Webpack config factory, activating it automatically for all node bundles. Thanks @enten :)
 - Moves the 'standard' babel config into the Webpack configFactory and instead lets the project config able to modify it via the plugin point.

### Changed

 - Updates dependencies.
 - Removes unnecessary dependency match-require.
 - Changes the eslint-disable-line instances to eslint-disable-next-line.

### Added

 - Adds `jest` as our test framework (we will be removing the jest feature branch).
 - Adds contributors to the About page.
 - Addings cross-env powered NODE_ENV setting on the build/start commands. This is purely for demonstration purposes, and can be removed/adjusted based on your own needs. closes #298
 - Adds 'manifest-src' to the CSP (closes #299).

### Fixed

 - Prevents the Vendor DLL from being cached by the browser.

## [11.0.1] - 2016-12-24

## Fixed

 - Fixes filterObject incorrect check on prop existence.
 - Removes unneeded flow fix-me comment.

### Changed

 - Changes the uuid call to use the explicit type call.

## [11.0.0] - 2016-12-23

### BREAKING

 - Huge refactor and simplification of the application configuration.  All the values are managed in a single location, with a new API introduced to help read config values in shared/client code. See the docs and code comments for more info.
 - Migrates babel configuration to stage-3 and higher only.

### Changes

 - Updates helmet.
 - Reworks the DLL-Plugin so that it uses the project's package.json dependencies with the ability to explicitly include/exclude dependencies via the config. (@strues)
 - Breaks down and restructures the README.md into docs folder.
 - Updates dependencies.
 - Updates to webpack 2 rc and fixes performance config.
 - Allows the service worker to be configurable.
 - Removes unneeded json-loader as it is by default enabled within webpack v2.

### Fixed

 - Minor fixes to the notifications in hot node servers.
 - Adds check for project config dev dll enable/disable flag when rendering the dev dll script.
 - Adds check for fatal webpack run error in production build script.

## [10.2.0] - 2016-12-13

### Changed

 - Changes the build script to output webpack stats.
 - Changes webpack performance hints to only execute for production builds.
 - Renames 'App' component to 'DemoApp'.
 - Adds new webpack beta release.

### Fixed

 - Fixes bug in development server.
 - Updates contributors list.

### Added

 - Adds .history to git ignores.

## [10.1.1] - 2016-12-12

### Changed

 - Updates dependencies.
 - Updates flow.

### Fixed

 - Fixes flow issues.
 - Fixes analyze script.

## [10.1.0] - 2016-12-12

### Fixed

 - Babel plugin config for bundles no longer includes the `.babelrc`.
 - Missing flow annotations preventing the flow removal script from working.
 - The happypack threadpool issue causing development server restarts to fail.

### Added

 - Extends the vendor DLL config so that file paths can be ignored. Typical test file paths have been added.

### Changed

 - Optimizes the preinstall script.
 - The hot development node servers only start after a successful client bundle build.
 - Refactors the development server so that it auto restarts for ANY config changes.
 - Updates dependencies.

## [10.0.1] - 2016-12-08

### Fixed

 - Fixes default configuration - production builds are now optimised by default.

### Changed

 - Updated to latest code-split-component (alpha-4).

## [10.0.0] - 2016-12-08

HUGE update!  This is the result of a culmination of work and input by @strues @enten @carsonperrotti @bkniffler.

The end result is a project which is far cleaner, well structured, and ready to scale for real world needs.

Some of the highlights below:

 - No more "universalMiddleware" bundle - this has been merged into the server source as a "reactApplication" middleware.
 - Centralised application configuration via the "./config" folder.
 - Environment variables have been dramatically simplified in way.  They are no longer used at build time, but rather at run time, giving you a greater degree of flexibility.  We have adjusted the way that we use the `dotenv` library to give you a greater degree of flexibility when defining configuration for multiple environments.  See the updated readme and comments within the source.
 - Fully functional offline capabilities! We finally cracked the service worker configuration to do this in a dependable manner that will respect any changes to future builds of your application - automatically pulling the updated content.
 - The webpack configuration has been generalised so that you can easily add new "node" bundles as and when needed.  It's a common requirement for larger scale projects to add a seperate "api" server for example.  This is now trivial to do, check the `./config/private/project.js` configuration file for more information.
 - Our node bundle transpilation has been optimised by using `babel-preset-env` which ensures that we only transpile the missing features for our target node version.
 - The entire project (including the tools) has been configured to use the exact same level of javascript syntax (i.e ES2017), using Babel to help us wherever needed. No more folder context switching!
 - Huuuuge clean up of source and documentation.
 - Tons of bug fixes.

I am sorry if this a pain to update to from your existing projects, but I genuinely feel that future updates to this project will be far less dramatic. In a way this feels like a "1.0.0" release, with all the previous ones being beta releases.

## [9.1.0] - 2016-12-05

### Fixed

The previous service worker implementation was completely incorrect, causing an aggressive cache on production that would not expire.  Please update to this latest version which makes use of the `offline-plugin` now.

## [9.0.0] - 2016-11-07

### Breaking

The v1 of code-split-component was not optimal in design and suffered from double render and checksum issues on production runs.  I have just done an alpha rewrite of this library which is completely optimised for to be used within an SSR environment, allowing for rehydration of code split chunks/modules on the client before a render occurs.  This means that the checksums exactly match the content returned by the server.  I know this is an alpha release of a library, but it's already working tons better than v1, and v1 in my opinion is completely broken.  Therefore I am fast tracking the upgrade of this starter kit to avoid the case where people inadvertently go to production with an inefficient model.

The major areas that have changed are the following:
 - /tools/webpack/configFactory
 - /src/client/index.js
 - /src/universalMiddleware/*
 - /src/shared/universal/components/App/App.js

Closes #159

### Added

 - You can disable the development vendor DLL feature via an environment variable. See the .env_example
 - You can set libraries to be ignored by the vendor DLL. See the .env_example

### Fixed

 - Issue with HappyPack configuration.  The threadloop configuration causes strange breaking behaviour on our development server. Thanks to @strues for this.  Closes #160

## [8.4.0] - 2016-11-02

## Changed

 - Cleans up existing commands, moving many of them into tools/scripts.
 - Major improvements to the `yarn run flow:remove` command.  It now removes _everything_ flow related from the project.  I mean everything.  Tread carefully. :)

## Added

 - An .editorconfig configuration. See http://editorconfig.org/
 - A webpack bundle analyze command.

## [8.3.0] - 2016-11-01

## Fixed

Finally fixed our Content Security Policy, and included a "nonce" strategy that allows us to declare known inline scripts safe for execution.  I would highly recommend you read the updated README.md as well as the comments within the src/server/index.js file.  Also pay special attention the "nonce" middleware and how we are using it within the "render" function of our universal middleware.  You will see I attach the nonce to the inline script used to load the service worker.  You will need to use a similar strategy for any other inline scripts you attach (for example state rehydration scripts).

Issue where flow exec script was printing extra error information when the flow command returns with a failure.

The flow-typed install will now overwrite existing defs.

## [8.2.0] - 2016-10-27

## Changed

Updates dependencies, including flow-bin to 0.34.

Removes flow-typed dir from the project and adds a new npm script allowing you to install the latest lib defs based on the project's current dependencies. The flow-typed dir shall remain ignored from the repository.  It will be up to you to include their installation within your CI workflows etc.

Updates the manifest.json to contain all icons as well as a start_url entry.

## Fixed

Disables the service worker script injection unless in production mode.

Fixes the http-equiv meta tags and moves them into the App component, managed by react-helmet now.

## [8.1.0] - 2016-10-27

### Added

Progressive Web Application support via manifest.json as well as a service worker giving us aggressive caching on our assets and offline support.

## [8.0.0] - 2016-10-27

### Breaking Changes

The project has evolved and I was experiencing issues with the rigid environment configuration.  Therefore the application configuration has been refactored, allowing for a much more flexible approach.  Manage your env variables the way you see fit. Provide them at build or runtime, or both.  Read all about it in the updated README.md.

Renamed the flow npm scripts.  Please check the package.json for the new values.

### Added

A new npm script to do deployment to `now`. Stop fighting it, and start using their services! :)

### Changed

Some restructuring and cleaning up of the build tools have taken place.

## [7.2.0] - 2016-10-26

### Added

A HappyPack and Vendor DLL implementation to improve the development experience.  The Vendor DLL is automatically calculated and build within the development server, reducing any management overhead.  We use a md5 hash against the project's dependencies to know when to rebuild the vendor dll. - thanks goes to @strues

## [7.1.0] - 2016-10-26

### Added

The flow-coverage-report tool with an associated npm script, allowing us to do coverage reporting for our flow types.

The react-helmet flow definition from flow-typed.

## [7.0.2] - 2016-10-23

### Fixed

The 'removetypes' npm script.

Invalid babel-preset-latest options pass-through.

React element type definition.

## [7.0.1] - 2016-10-19

### Fixed

Issue where the universalMiddleware was being bundled into the server bundle.

Duplicate react-router dependency on "devDependencies" and normal "dependencies".

Render function of middleware to not unnecessarily wrap the react output with an additional div.  This seem to have subvented the react checksum guard, even though the checksums should have failed.

### Changed

Updates to latest react-router 4 alpha.

## [7.0.0] - 2016-10-19

### Breaking Changes

Full refactor of the application, moving it onto react-router v4.  Our components have been structured in a nested manner to reflect the declarative nature of RR4.  No more centralised routing configuration!

Added code-split-component library to help us do declarative based Webpack 2 code splitting. This also simplifies our webpack configuration, no longer requiring the "context hack".

Moved flow-typed definitions back to the root directory as the flow-typed guys have stated that this will be the default moving forward.

Moves the RHL3 AppContainer resolution into a ReactHotLoader component.

Moved the custom react flow types into the /src/shared/universal/types/react.js file.

### Added

A new npm task allowing you to remove all flow types from the source.  You will just need to do some minor cleaning up thereafter.

### Fixed

Eslint import plugin version.

### Changed

Updated dependencies.

## [6.0.0] - 2016-09-29

### Breaking Changes

A huge refactor of the application structure has taken place.  Based on experience and using this boilerplate to build a larger application I noticed a lot of pain points, especially around the hot development experience.  In order to alleviate lots of these problems the application has been restructured to build into 3 separate bundles:

  - server
  - universalMiddleware
  - client

The universalMiddleware bundle is new bundle, and will be the middleware that our express server will use to server our universal react application.  Having it be built separately from the server allows you to target the bundle with a unique webpack configuration should you wish, whilst also allowing us to only rebuild the middleware when doing hot development.

Some other notable breaking changes:

  - The shared folders now contain two sub-folders, node and universal.  The universal folder should contain all the code that is shared and safe to include with any of the bundles, whilst the node subfolder should only contain code shared between the server or universalMiddleware bundles.
  - The favicon for the htmlPage render has been moved into the public folder.
  - We are using the babel-preset-latest for ALL of our bundles.  This allows you to use the same javascript syntax across any of them without worrying about what each target environment supports.  In the future this will be optimized so that the node bundles will only get the syntax that they are missing transpiled.
  - The webpack configuration DefinePlugin section has been refactored to specify the full `process.env.{key}` for each for the env vars we provide instead of replacing the whole `process.env` object.  This allows you to provide any additional custom env vars during execution time.


## [5.1.0] - 2016-09-27

### Fixed

An issue with the webpack configuration which prevented multiple chunks when build a dev version of the server bundle, this would then result in errors on resolving our async routes.  Phew!  That was a hard fought fight.

### Changed

Updates the routing configuration to be concise.

## [5.0.0] - 2016-09-27

### Breaking Change

Unfortunately webpack doesn't support System.import statements containing expressions when doing a target=node bundle.  Therefore I have had to reluctantly revert back to the more verbose previous way of doing things.

### Fixed

I have picked up on an issue with webpack's tree shaking feature. Importing a constant boolean value from another file (i.e. our config files) and wrapping a code block with an if statement based on the respective value doesn't result in tree shaking even if the value is false.  Therefore I have had to "inline" these statements, which does then result in tree shaking working.

For example:

    import { IS_HOT_DEVELOPMENT } from '../config';
    if (IS_HOT_DEVELOPMENT) {
      // tree shake me
    }

Has to be:

    if (process.env.NODE_ENV === 'development' && module.hot) {
      // tree shake me
    }

Please be aware of this.

## [4.1.0] - 2016-09-26

### Added

babel-polyfill to client bundle output.

### Fixed

Webpack context regex to be windows path friendly.

System.import expression within routes to not use a template string as Webpack throws warnings for these.

## [4.0.0] - 2016-09-24

### Breaking Changes

Big restructure and improvement to the dynamic routing / code splitting configuration.
We no longer need the previous manual import hacks for the routes to allow Hot Module Reloading to work. Yay!
The ~/src/shared/components/App/ now has subfolders, one for "lib" components (i.e. components to be reused across views/routes), and a "views" folder which will contain components used for our routes.
All our primary routes which we will use for code splitting have been moved to ~/src/shared/components/App/views

Environment variables from the .env files are now automatically applied to the webpack DefinePlugin section, no longer requiring any error prone manual intervention.

### Changed

Updates dependencies.

Minor optimization to bundle build size.

### Fixed

Adds missing plugin dependency for the transform-object-rest-spread babel plugin.

## [3.3.1] - 2016-08-11

### Changed

Moved flow files into the tools dir.

Minor enhancement to eslint config to play nicely with flow type imports.

Moved the styles/scripts imports from react-helmet to be below the application styles/scripts.

Cleaned up the config guards.

Updated the .envnow file resolution.

### Fixed

Added missing rimraf dependency.

## [3.3.0] - 2016-08-10

### Added

Flow type checking. Just a simple configuration for now, and we are only including definitions from the maintained 'flow-typed' repo. Closes #57

## [3.2.1] - 2016-08-10

### Changed

Moved public dir resolution into configs.

## [3.2.0] - 2016-08-10

### Added

The transform-object-rest-spread and transform-class-properties as they are too useful when developing react projects.

### Changed

Centralised env config values into config files so that they get parsed and validated in a single place and once.


## [3.1.0] - 2016-08-09

### Adds

Long-term caching support. Closes #58

Base robots.txt file to the public assets.

.ico to the static files supported file format lists in the webpack config factory.

### Changes

Pulled out utils from webpack configFactory.

Moved favicon to be colocated with the htmlPage.

The "public" folder is now routed to the HTTP root.

### Fixed

Fixed eslint rule on the configFactory.js

## [3.0.1] - 2016-08-09

### Changes

Changed url-loader to only emit files for client bundles.

Replaced "fake-style-loader" with "css-loader/locals".  Thanks @giltig! Closes #59

## [3.0.0] - 2016-08-09

### Breaking Changes

Complete restructure to the development and build tooling.  All put into the "tools" directory now.

Ripped out our runtime dependencies on webpack.  This was done by adding some new environment configuration variables and then combining them with the awesome 'app-root-dir' library.

### Changes

Improved the react-helmet implementation example.

## [2.0.0] - 2016-08-08

### Breaking Changes

The server side render method has been massively simplified as we are now using
react-helmet to control our page header from our components. Closes #11

### Added

A 'public' static files endpoint, with a favicon implementation. Closes #14

### Changed

The server render helper now resolves the 'assets.json' via the webpack configuration for the client bundle.

### Fixed

Small issue with the dev server not hot reloading when just the server code changes.

The projects dependencies structure so that the "dependencies" section contains ALL libraries that are required for the server runtime.  The "devDependencies" section contains the libraries required for building the project.  Fixes #27

## [1.2.2] - 2016-08-03

### Changed

Updated dependencies.

Fixed dependencies - moving required devDependencies into dependencies.

Fixed project to match latest eslint configuration.

Disabled the eslint rule required all files containing JSX to have a .jsx file extension.

## [1.2.1] - 2016-08-01

No Changes.  Version bump to fix npm documentation.

## [1.2.0] - 2016-08-01

### Changed

The devServer is far more robust, with webpack changes or process term signals resulting in any existing connections being forcefully disposed, whilst if only the server/client bundles get recompiled then existing connections are allowed to end.  This results in a much nice dev experience.

Simplified the externals configuration for the server, making it that we don't rely on manual intervention on a per library install basis.  Thanks @swernerx!!

Updated dependencies.

Node version to 6.3.1

## [1.1.2] - 2016-07-29

### Fixed

HMR reloading of asynchronous react-router routes.  We have had to add a workaround section within the routes configuration.  Please see the routes/index.js file for more info.

## [1.1.1] - 2016-07-26

### Fixed

Fixed the HMR configuration.  We were incorrectly using module.hot.accept() which would actually accept all changes. Instead we needed to target the direct file.

### Changed

Updated dependencies.

## [1.1.0] - 2016-07-24

### Added

url-loader with a configuration allowing for images/fonts to be imported. An
example of this has been included in the App component.

### Changed

Updated dependencies.

The client side router configuration now handles redirect and "no renderProps" cases.

## [1.0.1] - 2016-07-19

### Changed

Updated the following dependencies:
 - react-router
 - eslint
 - eslint-plugin-jsx-a11y

## [1.0.0] - 2016-07-18

### Added

Version 1 of the react-universally boilerplate.  From here on out we are all about semantic versioning with a clear recording of all changes made to the project.
