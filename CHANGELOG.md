# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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
