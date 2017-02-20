 - __[Project Overview](/internal/docs/PROJECT_OVERVIEW.md)__
 - [Project Configuration](/internal/docs/PROJECT_CONFIG.md)
 - [Package Script Commands](/internal/docs/PKG_SCRIPTS.md)
 - [Feature Branches](/internal/docs/FEATURE_BRANCHES.md)
 - [Deploy your very own Server Side Rendering React App in 5 easy steps](/internal/docs/DEPLOY_TO_NOW.md)
 - [FAQ](/internal/docs/FAQ.md)

# Project Overview

Below is a general overview of the project.

## TOC

 - [Bundled by Webpack](#bundled-by-webpack)
 - [Transpiled by Babel](#transpiled-by-babel)
 - [Security](#security)
 - [Folder Structure](#folder-structure)

## Bundled by Webpack

This starter uses Webpack 2 to produce bundles for both the client and the server. The `internal/webpack/configFactory.js` is used to generate the respective Webpack configuration for all our bundles. The factory is heavily commented to help you understand what is going on within the Webpack configuration.

> Note: Given that we are bundling our server code I have included the `source-map-support` module to ensure that we still get nice stack traces when executing our code.

## Transpiled by Babel

We use babel across the entire project, which allows us to use the same level of javascript (e.g. es2015/2016/2017) without having to worry which level of the language is supported within each of the project's modules.  We have decided to only support syntax that is stage-3 or up in the TC39 process, anything lower is considered too much of a risk to include by default, so it is up to you if you would like to extend your Babel configuration to include more "experimental" features.

We additionally make use of the `babel-preset-env` preset so that we only transpile the syntax that is not supported by target node platforms.

## Security

We make use of the `helmet` and `hpp` middleware libraries to provide a fairly advanced security configuration for our Express server, attempting to follow industry best practices. If you are unfamiliar with Content Security Policies then I highly recommend that you do some reading on the subject:

  - https://content-security-policy.com/
  - https://developers.google.com/web/fundamentals/security/csp/
  - https://developer.mozilla.org/en/docs/Web/Security/CSP
  - https://helmetjs.github.io/docs/csp/

For example, if you are relying on scripts/styles/assets from CDN or from any other server/application that is not hosted on the same URL as your application then you will need to explicitly add the respective CSN/Server URLs to the security middleware within the project.  For example you can see I have had to add the polyfill.io CDN in order to allow us to use the polyfill script.

You may find CSPs annoying at first, but it is a great habit to build. The CSP configuration is an optional item for helmet, however you should not remove it without making a serious consideration that you do not require the added security.

## Folder Structure

Below are some of the critical folders of the project along with a comment describing them.

```
/
|- config // Centralised project configuration.
|  |- values.js  // Configuration values
|  |- index.js  // Unified Configuration Reader API
|
|- build // The target output dir for our build commands.
|  |- client // The built client module.
|  |- server // The built server module.
|
|- server // The server bundle entry and specific source.
|- client // The client bundle entry and specific source.
|- shared // The shared code between the bundles.
|
|- internal
|  |- docs // Documentation
|  |- development // Development server.
|  |- webpack
|     |- configFactory.js  // Webpack configuration builder.
|
|- .env_example // An example from which to create your own .env file.
```

I highly recommend putting most of your application code into the `shared` folder where possible.  Then put anything that is specific to the `server`/`client` within their respective folder.
