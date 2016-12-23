 - __[Project Overview](/docs/ProjectOverview.md)__
 - [Application Configuration](/docs/ApplicationConfig.md)
 - [npm script commands](/docs/NPMCommands.md)
 - [Feature Branches](/docs/FeaturesBranches.md)
 - [Deploy your very own Server Side Rendering React App in 4 easy steps](/docs/DeployToNow.md)
 - [FAQ](/docs/FAQ.md)

# Project Overview

Below is a general overview of the project.

## TOC

 - [Bundled by Webpack](#bundled-by-webpack)
 - [Transpiled by Babel](#transpiled-by-babel)
 - [Security](#security)
 - [Folder Structure](#folder-structure)

## Bundled by Webpack

This starter uses Webpack 2 to produce bundles for both the client and the server. The `tools/webpack/configFactory.js` is used to generate the respective Webpack configuration for all our bundles. The factory is heavily commented to help you understand what is going on within the Webpack configuration.

> Note: Given that we are bundling our server code I have included the `source-map-support` module to ensure that we still get nice stack traces when executing our code.

## Transpiled by Babel

It also uses babel across the entire project, which allows us to use the same level of javascript (e.g. es2015/2016/2017) without having to worry which level of the language within each separate slice of the project.  We have decided to only support syntax that is stage-3 or up in the TC39 process, anything lower is considered too much of a risk to include by default, so it is up to you if you would like to extend your Babel configuration.

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
