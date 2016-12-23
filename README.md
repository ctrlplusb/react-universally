### Feature Branch

Note: This is a feature branch of `react-universally`. Please see [`FEATURE.md`](./FEATURE.md) for more information on this branch.

---

<p align='center'>
  <h1 align='center'>React, Universally</h1>
  <p align='center'><img width='150' src='https://raw.githubusercontent.com/ctrlplusb/assets/master/logos/react-universally.png' /></p>
  <p align='center'>A starter kit giving you the minimum requirements for a modern universal React application.</p>
</p>

## About

This starter kit contains all the build tooling and configuration you need to kick off your next universal React project, whilst containing a minimal "project" set up allowing you to make your own architecture decisions (Redux/MobX etc).

> However, we now include a set of "feature branches", each implementing a technology on top of the clean master branch.  This provides you with an example on how to integrate said technologies, or use the branches to merge in a configuration that meets your requirements.  See the [`Feature Branches`](/docs/FeaturesBranches.md) documentation for more.

## Features

  - 👀 `react` as the view.
  - 🔀 `react-router` v4 as the router.
  - 🚄 `express` server.
  - 🖌 Very basic CSS support - it's up to you to extend it with CSS Modules etc.
  - ✂️ Code splitting - easily define code split points in your source using `code-split-component`.
  - 🌍 Server Side Rendering.
  - 😎 Progressive Web Application ready, with offline support, via a Service Worker.
  - 🐘 Long term browser caching of assets with automated cache invalidation.
  - 📦 All source is bundled using Webpack v2.
  - 🚀 Full ES2017+ support - use the exact same JS syntax across the entire project (src/tools/config). No more folder context switching! We also only use syntax that is stage-3 or later in the TC39 process.
  - 🔧 Centralised application configuration with helpers to avoid boilerplate in your code.
  - 🔥 Extreme live development - hot reloading of ALL changes to client/server source, with auto development server restarts when your application configuration changes.  All this with a high level of error tolerance and verbose logging to the console.
  - ⛑ SEO friendly - `react-helmet` provides control of the page title/meta/styles/scripts from within your components.
  - 🤖 Optimised Webpack builds via HappyPack and an auto generated Vendor DLL for smooth development experiences.
  - 🍃 Tree-shaking, courtesy of Webpack.
  - 👮 Security on the `express` server using `helmet` and `hpp`.
  - 🏜 Asset bundling support. e.g. images/fonts.
  - ✔️ Type checking via Flow, a beautiful and unobtrusive type framework.

      __NOTE:__ Flow is a completely optional feature.  The flow type annotations get ripped out of the source by the Webpack build step. You have no obligation to use flow within your code and can happily code without applying it to any new code.  I do highly recommend you try it out though. :)

      If you don't really don't want to use flow then you can run `npm run flow:remove`. This will make it as though flow never existed within the project.
  - 🎛 Preconfigured to support development and optimised production builds.
  - 👼 Airbnb's ESlint configuration.
  - ❤️ Preconfigured to deploy to `now` with a single command.

Redux/MobX, data persistence, test frameworks, and all the other bells and whistles have been explicitly excluded from this boilerplate.  It's up to you to decide what technologies you would like to add to your own implementation based upon your own needs, this boilerplate simply serves as a clean base upon which to do so.

## Getting started

Here is all you need to do to get started:

```bash
git clone https://github.com/ctrlplusb/react-universally my-project
cd my-project
npm run development
```

Go make some changes to the `Home` component to see the tooling in action.

## Docs

 - [Project Overview](/docs/ProjectOverview.md)
 - [Application Configuration](/docs/ApplicationConfig.md)
 - [npm script commands](/docs/NPMCommands.md)
 - [Feature Branches](/docs/FeaturesBranches.md)
 - [Deploy your very own Server Side Rendering React App in 4 easy steps](/docs/DeployToNow.md)
 - [FAQ](/docs/FAQ.md)
