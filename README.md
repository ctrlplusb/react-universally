<p align='center'>
  <h1 align='center'>React, Universally</h1>
  <p align='center'><img width='150' src='https://raw.githubusercontent.com/ctrlplusb/react-universally/master/assets/logo.png' /></p>
  <p align='center'>An ultra low dependency node v6 universal react boilerplate.</p>
</p>

## About

This boilerplate contains a super minimal set of dependencies in order to get
you up and running with a universal react project, whilst also providing you with a great development experience that includes hot reloading of the client and server code.

It doesn't try to dictate how you should build your entire application, rather it provides a clean and simple base on which you can expand.  

## Run-time Dependencies

  - `node` v6
  - `compression` - Gzip compression support for express server responses.
  - `express` - Web server.
  - `helmet` - Provides a content security policy for express.
  - `hpp` - Express middleware to protect against HTTP Parameter Pollution attacks.
  - `react` - A declarative, efficient, and flexible JavaScript library for building user interfaces.
  - `react-dom` - React support for the DOM.
  - `react-router` - A complete routing library for React.
  - `serialize-javascript` - A superset of JSON that includes regular expressions and functions.
  - `source-map-support` - Adds source map support to node.js (for stack traces).

## Overview

This boilerplate uses Webpack 2 to produce bundles for both the client and the
server code.  You will notice two Webpack configuration files that allow you to target the respective environments:

   - `webpack.client.config.js`
   - `webpack.server.config.js`

The source is written in ES2015, and it explicitly keeps to the standard syntax, not exposing any proposal syntax via additional babel plugins/presets.  As we are following this approach it is unnecessary for us to transpile our server bundle to ES5, taking advantage of `node` v6's native support.  Our client (browser) bundle is however transpiled to ES5 code for maximum browser/device support.

Given we are bundling both our client and server code we have included the `source-map-support` module to ensure that we get source map support on node, allowing for nice stack traces on our server code.

Application configuration is supported by `dotenv` and requires you to create a `.env` file (you can use the `.env_example` as a base).  The `.env` file has been explicitly ignored from git as it will typically contain environment sensitive/specific information.  In the usual case your continuous deployment tool of choice should configure the specific `.env` file that is needed for a target environment. 

## Deploy your very own Server Side Rendering React App in 5 easy steps ##

__Step 1: Clone the repository.__

    git clone https://github.com/ctrlplusb/react-universally

__Step 2: `cd` into the cloned directory__

    cd react-universally

__Step 3: Set up your env configuration file__

The application depends on environment settings which are exposed to the application via a `.env` file.  You will have to create one of these using the example version (`.env_example`).  You could simply copy the example:

    cp .env_example .env
    
I would recommend that you review the options within the `.env` file.

__Step 4: Install the awesome "now" CLI__

    npm install -g now
    
These guys are amazing hosts.  [Check them out.](https://zeit.co/now#)

__Step 5: Deploy to "now"__

    cp .env .envnow && now  && rm -r .envnow
    
The above command will create a temporary file to expose your `.env` file to the `now` host.  It will then deploy to `now` and subsequently delete the temp env file.

That's it.  Your clipboard will contain the address of the deployed app. Open your browser, paste, go.  

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
