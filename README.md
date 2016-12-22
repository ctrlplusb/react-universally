<p align='center'>
  <h1 align='center'>React, Universally</h1>
  <p align='center'><img width='150' src='https://raw.githubusercontent.com/ctrlplusb/assets/master/logos/react-universally.png' /></p>
  <p align='center'>A starter kit giving you the minimum requirements for a modern universal React application.</p>
</p>

## About

This starter kit contains all the build tooling and configuration you need to kick off your next universal React project, whilst containing a minimal "project" set up allowing you to make your own architecture decisions (Redux/MobX etc).

However, we now include a set of "feature branches", each implementing a technology on top of the clean master branch.  This provides you with an example on how to integrate said technologies, or use the branches to merge in a configuration that meets your requirements.  See the [`Feature Branches`](https://github.com/ctrlplusb/react-universally#feature-branches) section below.

## Features

  - 🌍 Server Side Rendering React application.
  - 😎 Progressive Web Application ready, with offline support, via a Service Worker.
  - 🐘 Long term browser caching of assets with automated cache invalidation.
  - 📦 All source is bundled using Webpack v2.
  - 🚀 Full ES2017+ support - use the exact same JS syntax across the entire project (src/tools/config). No more folder context switching! We also only use syntax that is stage-3 or later in the TC39 process.
  - 🔧 Centralised application configuration with helpers to avoid boilerplate in your code.
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

Redux/MobX, data persistence, test frameworks, and all the other bells and whistles have been explicitly excluded from this boilerplate.  It's up to you to decide what technologies you would like to add to your own implementation based upon your own needs, this boilerplate simply serves as a clean base upon which to do so.

This boilerplate uses Webpack 2 to produce bundles for both the client and the
server.  `tools/webpack/configFactory.js` is used to generate the respective Webpack configuration for all our bundles. The factory is heavily commented to help you understand what is going on within the Webpack configuration.

We use babel across the entire project, which allows us to use the same level of javascript (e.g. es2015/2016/2017) without having to worry which level of the language within each separate slice of the project.  

Note: Given that we are bundling our server code I have included the `source-map-support` module to ensure that we still get nice stack traces when executing our code.

## Docs

 - [Feature Branches](/docs/FeaturesBranches.md)
 - [Application Configuration](/docs/ApplicationConfig.md) - ___Highly recommended reading___
 - [Security](/docs/Security.md)
 - [Project Structure](/docs/ProjectStructure.md)
 - [Deploy your very own Server Side Rendering React App in 4 easy steps](/docs/DeployToNow.md)
 - [npm script commands](#npm-script-commands)
 - [FAQ](/docs/FAQ.md)
