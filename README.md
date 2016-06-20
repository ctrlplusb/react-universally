# react-universally

A mildly opinionated ultra low dependency universal react boilerplate. 

## About

This boilerplate contains a super minimal set of dependencies in order to get
you up and running with a universal react project, whilst also providing you with a great development experience that includes hot reloading of the client and server code.

It doesn't try to dictate how you should build your entire application, rather it provides a clean and simple base on which you can expand.  

## Overview

The boilerplate uses Webpack 2 to produce bundles for both the client and the
server code.  You will notice two Webpack configuration files that allow you to target the respective environments:

   - `webpack.client.config.js`
   - `webpack.server.config.js`

All code is executed via the webpack bundles, in both development and production mode.

It includes a very basic `express` server with a minimal security configuration.

Routing is achieved via `react-router`.

Application configuration is achieved using the `dotenv` module.

## Get it running on your machine ##

Clone the repository.

    git clone https://github.com/ctrlplusb/react-universally
    
The application depends on environment settings which are exposed to the application via a `.env` file.  You will have to create one of these using the example version (`.env_example`).  You could simply copy the example:

    cp .env_example .env
    
I would recommend that you review the options within the `.env` file.

That's it. You can then execute the npm script commands to build/execute the application.

## npm script commands##

### `npm run development`

Starts a development server for both the client and server bundles.  We use `react-hot-loader` v3 to power the hot reloading of the client bundle, whilst a filesystem watch is implemented to reload the server bundle when any changes have occurred.

### `npm run build`

Builds the client and server bundles, with the output being production optimized.

### `npm run start`

Executes the server.  It expects you to have already built the bundles either via the `npm run build` command or manually.

### `npm run clean`

Deletes any build output that would have originated from the other commands.

## References ##

  - __Webpack 2__ - https://gist.github.com/sokra/27b24881210b56bbaff7
  - __React Hot Loader v3__ - https://github.com/gaearon/react-hot-boilerplate/pull/61
  - __dotenv__ - https://github.com/bkeepers/dotenv
