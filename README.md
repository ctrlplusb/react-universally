<p align='center'>
  <h1 align='center'>React, Universally</h1>
  <p align='center'><img width='150' src='https://raw.githubusercontent.com/ctrlplusb/react-universally/master/assets/logo.png' /></p>
  <p align='center'>An ultra low dependency node v6 universal react boilerplate.</p>
</p>

## TOC

 - [About](https://github.com/ctrlplusb/react-universally#about)
 - [Overview](https://github.com/ctrlplusb/react-universally#overview)
 - [Project Structure](https://github.com/ctrlplusb/react-universally#project-structure)
 - [Runtime Dependencies](https://github.com/ctrlplusb/react-universally#runtime-dependencies)
 - [Deploy your very own Server Side Rendering React App in 5 easy steps](https://github.com/ctrlplusb/react-universally#deploy-your-very-own-server-side-rendering-react-app-in-5-easy-steps)
 - [npm script commands](https://github.com/ctrlplusb/react-universally#npm-script-commands)
 - [References](https://github.com/ctrlplusb/react-universally#references)

## About

This boilerplate contains a super minimal set of dependencies in order to get
you up and running with a universal react project, whilst also providing you with a great development experience that includes hot reloading of the client and server code. 

## Overview

The core tech stack includes the following:

  - __node v6__ - mmmmm es2015 support.
  - __express__ - web server.
  - __react__ - yep.
  - __react-router__ - routing for both server and client.
  - __dotenv__ - environment configuration.
  - __babel__ - transpilation for browsers.
  - __webpack 2__ - bundling (with tree shaking) for the server and client.

That's about it really.  Redux/MobX, data persistence, test frameworks, CSS/CSSInJS loaders, Image loaders, and all the other bells and whistles have been explicitly excluded from this boilerplate.  Its up to you to decide what technologies you would like to add to your own implementation based upon your own needs, this boilerplate simply serves as a clean base upon which to do so.

If you would like to reference a more opinionated boilerplate, then have a look at [React, Univerally (Opinionated)](https://github.com/ctrlplusb/react-universally-opinionated). However, I must warn you that implementation is highly structured to meet my own development requirements.  I would recommend that you simply fish ideas from it and implement them in your own codebase.

This boilerplate uses Webpack 2 to produce bundles for both the client and the
server code.  You will notice two Webpack configuration files that allow you to target the respective environments:

   - `webpack.client.config.js`
   - `webpack.server.config.js`

Both of these then call into the `webpackConfigFactory.js` in order to generate their respective webpack configurations.  I've tried to keep the webpack configuration as centralized and well documented as possible as it can be a confusing topic at times.

I have decided to use webpack for bundling of both the client and the server as this will bring greater interop and extensibility to the table, allowing server bundles to handle React components that introduce things like CSS or Images.

Given that we are bundling our server code I have included the `source-map-support` module to ensure that we get nice stack traces when executing our code via node.

All the source code is written in ES2015, and I have explicitly kept it to the true specification (bar JSX syntax).  As we are following this approach it is unnecessary for us to transpile our source code for the server into ES5, as `node` v6 has native support for almost all of the ES2015 syntax.  Our client (browser) bundle is however transpiled to ES5 code for maximum browser/device support.

The application configuration is supported by the `dotenv` module and it requires you to create a `.env` file in the project root (you can use the `.env_example` as a base).  The `.env` file has been explicitly ignored from git as it will typically contain environment sensitive/specific information.  In the usual case your continuous deployment tool of choice should configure the specific `.env` file that is needed for a target environment. 

## Project Structure

```
/
|- build // The target output dir for our build commands.
|  |- client // The built client module.
|  |- server // The built server module
| 
|- src  // All the source code
|  |- server // The server specific source
|  |- client // The client specific source
|  |- shared // The shared code between the client/server
|
|- .env_example // An example from which to create your own .env file.  
|- devServer.js // Creates a hot reloading development environment
|- webpack.client.config.js // Client target webpack configuration
|- webpack.server.config.js // Server target webpack configuration
|- webpackConfigFactory.js  // Webpack configuration builder 
```

## Runtime Dependencies

Even though we are using webpack to support our universal application we keep the webpack runtime out of our production runtime environment.  Everything is prebundled in prep for production exection.  Therefore we only have the following runtime dependencies:

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
