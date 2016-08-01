# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.1] - 2016-08-01

No Changes.  Version bump to fix npm documentation.

## [1.2.0] - 2016-08-01

## Changed

The devServer is far more robust, with webpack changes or process term signals resulting in any existing conenctions being forcefully disposed, whilst if only the server/client bundles get recompiled then existing connections are allowed to end.  This results in a much nice dev experience.

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

Updated the following dependecies:
 - react-router
 - eslint
 - eslint-plugin-jsx-a11y

## [1.0.0] - 2016-07-18

### Added

Version 1 of the react-universally boilerplate.  From here on out we are all about semantic versioning with a clear recording of all changes made to the project.
