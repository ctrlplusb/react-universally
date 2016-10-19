# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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

Ripped out our runtime dependencies on webpack.  This was done by adding some new environment configuration variables and then combining them with the awesome 'app-root-path' library.

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
