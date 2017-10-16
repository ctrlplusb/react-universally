<p align='center'>
  <h1 align='center'>React, Universally</h1>
  <p align='center'><img width='150' src='https://raw.githubusercontent.com/ctrlplusb/assets/master/logos/react-universally.png' /></p>
  <p align='center'>A starter kit for universal react applications.</p>
</p>

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
  - 👮 Security on the `express` server using `helmet` and `hpp`.
  - 🏜 Asset bundling support. e.g. images/fonts.
  - 🎛 Preconfigured to support development and optimised production builds.
  - ❤️ Preconfigured to deploy to `now` with a single command.

Redux/MobX, data persistence, modern styling frameworks and all the other bells and whistles have been explicitly excluded from this starter kit.  It's up to you to decide what technologies you would like to add to your own implementation based upon your own needs.

## Getting started

```bash
git clone https://github.com/ctrlplusb/react-universally my-project
cd my-project
npm install
npm run develop
```

Now go make some changes to the `Home` component to see the tooling in action.

## Docs

 - [Project Overview](/docs/PROJECT_OVERVIEW.md)
 - [Project Configuration](/docs/PROJECT_CONFIG.md)
 - [Package Script Commands](/docs/PKG_SCRIPTS.md)
 - [FAQ](/docs/FAQ.md)
 - [Deploy your very own Server Side Rendering React App in 5 easy steps](/docs/DEPLOY_TO_NOW.md)
 - [Changelog](/CHANGELOG.md)

## Who's using it and where?

You can see who is using it and how in [the comments here](https://github.com/ctrlplusb/react-universally/issues/437). Feel free to add to that telling us how you are using it, we'd love to hear from you.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars3.githubusercontent.com/u/3148205?v=3" width="100px;"/><br /><sub>Alin Porumb</sub>](https://github.com/alinporumb)<br /> | [<img src="https://avatars2.githubusercontent.com/u/105919?v=4" width="100px;"/><br /><sub>长天之云</sub>](http://ambar.li)<br /> | [<img src="https://avatars0.githubusercontent.com/u/1468790?v=4" width="100px;"/><br /><sub>Alex Berdyshev</sub>](https://github.com/berdof)<br /> | [<img src="https://avatars3.githubusercontent.com/u/27766592?v=4" width="100px;"/><br /><sub>andersoo</sub>](https://github.com/andersoo)<br /> | [<img src="https://avatars3.githubusercontent.com/u/243161?v=3" width="100px;"/><br /><sub>Andrés Calabrese</sub>](https://github.com/aoc)<br /> | [<img src="https://avatars3.githubusercontent.com/u/1965897?v=3" width="100px;"/><br /><sub>Andrey Luiz</sub>](https://andreyluiz.github.io/)<br /> | [<img src="https://avatars2.githubusercontent.com/u/9633371?v=4" width="100px;"/><br /><sub>Anuj</sub>](http://shuffle.do)<br /> |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars0.githubusercontent.com/u/4349324?v=3" width="100px;"/><br /><sub>Benjamin Kniffler</sub>](https://github.com/bkniffler)<br /> | [<img src="https://avatars2.githubusercontent.com/u/1776695?v=4" width="100px;"/><br /><sub>Bernd Wessels</sub>](https://github.com/BerndWessels)<br /> | [<img src="https://avatars0.githubusercontent.com/u/180773?v=3" width="100px;"/><br /><sub>Birkir Rafn Guðjónsson</sub>](https://medium.com/@birkir.gudjonsson)<br /> | [<img src="https://avatars0.githubusercontent.com/u/2063102?v=3" width="100px;"/><br /><sub>Carson Perrotti</sub>](http://carsonperrotti.com)<br /> | [<img src="https://avatars2.githubusercontent.com/u/8458838?v=4" width="100px;"/><br /><sub>Chi</sub>](https://consiiii.me)<br /> | [<img src="https://avatars3.githubusercontent.com/u/364786?v=4" width="100px;"/><br /><sub>Chris Martin</sub>](https://github.com/trbngr)<br /> | [<img src="https://avatars1.githubusercontent.com/u/13365531?v=3" width="100px;"/><br /><sub>Christian Glombek</sub>](https://github.com/LorbusChris)<br /> |
| [<img src="https://avatars3.githubusercontent.com/u/603683?v=3" width="100px;"/><br /><sub>Christoph Werner</sub>](https://twitter.com/code_punkt)<br /> | [<img src="https://avatars2.githubusercontent.com/u/3210598?v=4" width="100px;"/><br /><sub>Ciornii Maxim</sub>](https://github.com/maximblack)<br /> | [<img src="https://avatars2.githubusercontent.com/u/12968163?v=4" width="100px;"/><br /><sub>Code Review Videos</sub>](https://codereviewvideos.com/)<br /> | [<img src="https://avatars1.githubusercontent.com/u/649879?v=4" width="100px;"/><br /><sub>Corey Gouker</sub>](https://coreygo.com)<br /> | [<img src="https://avatars3.githubusercontent.com/u/4538567?v=4" width="100px;"/><br /><sub>Dario Banfi</sub>](http://dariobanfi.github.io)<br /> | [<img src="https://avatars0.githubusercontent.com/u/1399894?v=3" width="100px;"/><br /><sub>David Edmondson</sub>](https://github.com/threehams)<br /> | [<img src="https://avatars0.githubusercontent.com/u/10954870?v=3" width="100px;"/><br /><sub>Dion Dirza</sub>](https://github.com/diondirza)<br /> |
| [<img src="https://avatars3.githubusercontent.com/u/1834664?v=4" width="100px;"/><br /><sub>Dominique Rau</sub>](https://github.com/DomiR)<br /> | [<img src="https://avatars1.githubusercontent.com/u/4669986?v=4" width="100px;"/><br /><sub>Elod-Arpad Szopos</sub>](https://github.com/elodszopos)<br /> | [<img src="https://avatars0.githubusercontent.com/u/254095?v=3" width="100px;"/><br /><sub>Evgeny Boxer</sub>](https://github.com/evgenyboxer)<br /> | [<img src="https://avatars2.githubusercontent.com/u/14076373?v=4" width="100px;"/><br /><sub>gooddaddy</sub>](https://github.com/gooddaddy)<br /> | [<img src="https://avatars0.githubusercontent.com/u/17959487?v=4" width="100px;"/><br /><sub>gufran mirza</sub>](http://gufranmirza.com)<br /> | [<img src="https://avatars1.githubusercontent.com/u/54462?v=4" width="100px;"/><br /><sub>HaveF</sub>](https://github.com/HaveF)<br /> | [<img src="https://avatars2.githubusercontent.com/u/191304?v=3" width="100px;"/><br /><sub>Joe Kohlmann</sub>](http://kohlmannj.com)<br /> |
| [<img src="https://avatars0.githubusercontent.com/u/1781281?v=4" width="100px;"/><br /><sub>kdavh</sub>](https://github.com/kdavh)<br /> | [<img src="https://avatars3.githubusercontent.com/u/11768029?v=4" width="100px;"/><br /><sub>Kevin Siow</sub>](http://www.passerelle.co)<br /> | [<img src="https://avatars2.githubusercontent.com/u/24992?v=3" width="100px;"/><br /><sub>Lucian Lature</sub>](https://www.linkedin.com/in/lucianlature/)<br /> | [<img src="https://avatars1.githubusercontent.com/u/1624703?v=3" width="100px;"/><br /><sub>Mark Shlick</sub>](https://github.com/markshlick)<br /> | [<img src="https://avatars3.githubusercontent.com/u/1078554?v=4" width="100px;"/><br /><sub>Nick Ribal</sub>](http://stackoverflow.com/story/elektronik)<br /> | [<img src="https://avatars2.githubusercontent.com/u/4996164?v=4" width="100px;"/><br /><sub>omerts</sub>](https://github.com/omerts)<br /> | [<img src="https://avatars0.githubusercontent.com/u/213146?v=4" width="100px;"/><br /><sub>Paul Rad</sub>](https://www.paulrad.com)<br /> |
| [<img src="https://avatars1.githubusercontent.com/u/7436773?v=3" width="100px;"/><br /><sub>Ryan Lindskog</sub>](https://www.RyanLindskog.com/)<br /> | [<img src="https://avatars1.githubusercontent.com/u/977713?v=3" width="100px;"/><br /><sub>Steven Enten</sub>](http://enten.fr)<br /> | [<img src="https://avatars1.githubusercontent.com/u/12164768?v=3" width="100px;"/><br /><sub>Sean Matheson</sub>](http://www.ctrlplusb.com)<br /> | [<img src="https://avatars1.githubusercontent.com/u/2743180?v=3" width="100px;"/><br /><sub>Sérgio A. Kopplin</sub>](https://koppl.in)<br /> | [<img src="https://avatars0.githubusercontent.com/u/6218853?v=3" width="100px;"/><br /><sub>Steven Truesdell</sub>](https://steventruesdell.com)<br /> | [<img src="https://avatars1.githubusercontent.com/u/544097?v=4" width="100px;"/><br /><sub>Stefan Mirea</sub>](https://sageproject.com)<br /> | [<img src="https://avatars2.githubusercontent.com/u/2536916?v=4" width="100px;"/><br /><sub>Sviatoslav</sub>](https://github.com/SleepWalker)<br /> |
| [<img src="https://avatars0.githubusercontent.com/u/10552487?v=3" width="100px;"/><br /><sub>Thomas Leitgeb</sub>](https://twitter.com/_datoml)<br /> | [<img src="https://avatars0.githubusercontent.com/u/595711?v=3" width="100px;"/><br /><sub>Tyler Nieman</sub>](http://tsnieman.net/)<br /> | [<img src="https://avatars2.githubusercontent.com/u/1762868?v=4" width="100px;"/><br /><sub>Vicente de Alencar</sub>](https://github.com/vicentedealencar)<br /> | [<img src="https://avatars3.githubusercontent.com/u/3311717?v=4" width="100px;"/><br /><sub>Yaniv kalfa</sub>](https://github.com/yanivkalfa)<br /> |
<!-- ALL-CONTRIBUTORS-LIST:END -->
