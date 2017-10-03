<p align='center'>
  <h1 align='center'>React, Universally</h1>
  <p align='center'><img width='150' src='https://raw.githubusercontent.com/ctrlplusb/assets/master/logos/react-universally.png' /></p>
  <p align='center'>A starter kit for universal react applications.</p>
</p>

[![All Contributors](https://img.shields.io/badge/all_contributors-20-orange.svg?style=flat-square)](#contributors)

## About

This starter kit contains all the build tooling and configuration you need to kick off your next universal React project, whilst containing a minimal "project" set up allowing you to make your own architecture decisions (Redux/MobX etc).

> NOTICE: Please read this important [issue](https://github.com/ctrlplusb/react-universally/issues/409) about the behaviour of this project when using `react-async-component`, which is by default bundled with it.

## Features

  - 👀 `react` as the view.
  - 🔀 `react-router` v4 as the router.
  - 🚄 `express` server.
  - 🎭 `jest` as the test framework.
  - 💄 Combines `prettier` and Airbnb's ESlint configuration - performing code formatting on commit. Stop worrying about code style consistency.
  - 🖌 Very basic CSS support - it's up to you to extend it with CSS Modules etc.
  - ✂️ Code splitting - easily define code split points in your source using `react-async-component`.
  - 🌍 Server Side Rendering.
  - 😎 Progressive Web Application ready, with offline support, via a Service Worker.
  - 🐘 Long term browser caching of assets with automated cache invalidation.
  - 📦 All source is bundled using Webpack v3.
  - 🚀 Full ES2017+ support - use the exact same JS syntax across the entire project. No more folder context switching! We also only use syntax that is stage-3 or later in the TC39 process.
  - 🔧 Centralised application configuration with helpers to avoid boilerplate in your code. Also has support for environment specific configuration files.
  - 🔥 Extreme live development - hot reloading of ALL changes to client/server source, with auto development server restarts when your application configuration changes.  All this with a high level of error tolerance and verbose logging to the console.
  - ⛑ SEO friendly - `react-helmet` provides control of the page title/meta/styles/scripts from within your components.
  - 🤖 Optimised Webpack builds via HappyPack and an auto generated Vendor DLL for smooth development experiences.
  - 🍃 Tree-shaking, courtesy of Webpack.
  - 👮 Security on the `express` server using `helmet` and `hpp`.
  - 🏜 Asset bundling support. e.g. images/fonts.
  - 🎛 Preconfigured to support development and optimised production builds.
  - ❤️ Preconfigured to deploy to `now` with a single command.

Redux/MobX, data persistence, modern styling frameworks and all the other bells and whistles have been explicitly excluded from this starter kit.  It's up to you to decide what technologies you would like to add to your own implementation based upon your own needs.

> However, we now include a set of "feature branches", each implementing a technology on top of the clean master branch.  This provides you with an example on how to integrate said technologies, or use the branches to merge in a configuration that meets your requirements.  See the [`Feature Branches`](/internal/docs/FEATURE_BRANCHES.md) documentation for more.

## Getting started

```bash
git clone https://github.com/ctrlplusb/react-universally my-project
cd my-project
npm install
npm run develop
```

Now go make some changes to the `Home` component to see the tooling in action.

## Docs

 - [Project Overview](/internal/docs/PROJECT_OVERVIEW.md)
 - [Project Configuration](/internal/docs/PROJECT_CONFIG.md)
 - [Package Script Commands](/internal/docs/PKG_SCRIPTS.md)
 - [FAQ](/internal/docs/FAQ.md)
 - [Feature Branches](/internal/docs/FEATURE_BRANCHES.md)
 - [Deploy your very own Server Side Rendering React App in 5 easy steps](/internal/docs/DEPLOY_TO_NOW.md)
 - [Changelog](/CHANGELOG.md)

## Who's using it and where?

You can see who is using it and how in [the comments here](https://github.com/ctrlplusb/react-universally/issues/437). Feel free to add to that telling us how you are using it, we'd love to hear from you.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars3.githubusercontent.com/u/243161?v=3" width="100px;"/><br /><sub>Andrés Calabrese</sub>](https://github.com/aoc)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=aoc) | [<img src="https://avatars3.githubusercontent.com/u/1965897?v=3" width="100px;"/><br /><sub>Andrey Luiz</sub>](https://andreyluiz.github.io/)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=andreyluiz) | [<img src="https://avatars3.githubusercontent.com/u/3148205?v=3" width="100px;"/><br /><sub>Alin Porumb</sub>](https://github.com/alinporumb)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=alinporumb) | [<img src="https://avatars0.githubusercontent.com/u/4349324?v=3" width="100px;"/><br /><sub>Benjamin Kniffler</sub>](https://github.com/bkniffler)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=bkniffler) | [<img src="https://avatars0.githubusercontent.com/u/180773?v=3" width="100px;"/><br /><sub>Birkir Rafn Guðjónsson</sub>](https://medium.com/@birkir.gudjonsson)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Abirkir) [💻](https://github.com/ctrlplusb/react-universally/commits?author=birkir) 👀 | [<img src="https://avatars0.githubusercontent.com/u/2063102?v=3" width="100px;"/><br /><sub>Carson Perrotti</sub>](http://carsonperrotti.com)<br />💬 [💻](https://github.com/ctrlplusb/react-universally/commits?author=carsonperrotti) [📖](https://github.com/ctrlplusb/react-universally/commits?author=carsonperrotti) 👀 | [<img src="https://avatars1.githubusercontent.com/u/13365531?v=3" width="100px;"/><br /><sub>Christian Glombek</sub>](https://github.com/LorbusChris)<br />[🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3ALorbusChris) [💻](https://github.com/ctrlplusb/react-universally/commits?author=LorbusChris) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars3.githubusercontent.com/u/603683?v=3" width="100px;"/><br /><sub>Christoph Werner</sub>](https://twitter.com/code_punkt)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Acodepunkt) [💻](https://github.com/ctrlplusb/react-universally/commits?author=codepunkt) 👀 | [<img src="https://avatars0.githubusercontent.com/u/1399894?v=3" width="100px;"/><br /><sub>David Edmondson</sub>](https://github.com/threehams)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=threehams) | [<img src="https://avatars0.githubusercontent.com/u/10954870?v=3" width="100px;"/><br /><sub>Dion Dirza</sub>](https://github.com/diondirza)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Adiondirza) [💻](https://github.com/ctrlplusb/react-universally/commits?author=diondirza) [📖](https://github.com/ctrlplusb/react-universally/commits?author=diondirza) 👀 | [<img src="https://avatars0.githubusercontent.com/u/254095?v=3" width="100px;"/><br /><sub>Evgeny Boxer</sub>](https://github.com/evgenyboxer)<br />[🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Aevgenyboxer) [💻](https://github.com/ctrlplusb/react-universally/commits?author=evgenyboxer) | [<img src="https://avatars2.githubusercontent.com/u/191304?v=3" width="100px;"/><br /><sub>Joe Kohlmann</sub>](http://kohlmannj.com)<br />[🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Akohlmannj) [💻](https://github.com/ctrlplusb/react-universally/commits?author=kohlmannj) | [<img src="https://avatars2.githubusercontent.com/u/24992?v=3" width="100px;"/><br /><sub>Lucian Lature</sub>](https://www.linkedin.com/in/lucianlature/)<br />[🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Alucianlature) [💻](https://github.com/ctrlplusb/react-universally/commits?author=lucianlature) 👀 | [<img src="https://avatars1.githubusercontent.com/u/1624703?v=3" width="100px;"/><br /><sub>Mark Shlick</sub>](https://github.com/markshlick)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=markshlick) |
| [<img src="https://avatars1.githubusercontent.com/u/7436773?v=3" width="100px;"/><br /><sub>Ryan Lindskog</sub>](https://www.RyanLindskog.com/)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=rlindskog) | [<img src="https://avatars1.githubusercontent.com/u/977713?v=3" width="100px;"/><br /><sub>Steven Enten</sub>](http://enten.fr)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Aenten) [💻](https://github.com/ctrlplusb/react-universally/commits?author=enten) 👀 | [<img src="https://avatars1.githubusercontent.com/u/12164768?v=3" width="100px;"/><br /><sub>Sean Matheson</sub>](http://www.ctrlplusb.com)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Actrlplusb) [💻](https://github.com/ctrlplusb/react-universally/commits?author=ctrlplusb) [📖](https://github.com/ctrlplusb/react-universally/commits?author=ctrlplusb) 💡 👀 [⚠️](https://github.com/ctrlplusb/react-universally/commits?author=ctrlplusb) 🔧 | [<img src="https://avatars0.githubusercontent.com/u/6218853?v=3" width="100px;"/><br /><sub>Steven Truesdell</sub>](https://steventruesdell.com)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Astrues) [💻](https://github.com/ctrlplusb/react-universally/commits?author=strues) [📖](https://github.com/ctrlplusb/react-universally/commits?author=strues) [⚠️](https://github.com/ctrlplusb/react-universally/commits?author=strues) | [<img src="https://avatars0.githubusercontent.com/u/10552487?v=3" width="100px;"/><br /><sub>Thomas Leitgeb</sub>](https://twitter.com/_datoml)<br />[🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Adatoml) [💻](https://github.com/ctrlplusb/react-universally/commits?author=datoml) | [<img src="https://avatars0.githubusercontent.com/u/595711?v=3" width="100px;"/><br /><sub>Tyler Nieman</sub>](http://tsnieman.net/)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=tsnieman) |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
