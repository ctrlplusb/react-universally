 - [Project Overview](/internal/docs/PROJECT_OVERVIEW.md)
 - [Project Configuration](/internal/docs/PROJECT_CONFIG.md)
 - __[Package Script Commands](/internal/docs/PKG_SCRIPTS.md)__
 - [Feature Branches](/internal/docs/FEATURE_BRANCHES.md)
 - [Deploy your very own Server Side Rendering React App in 5 easy steps](/internal/docs/DEPLOY_TO_NOW.md)
 - [FAQ](/internal/docs/FAQ.md)

# Package Scripts

## `yarn run analyze:client`

Creates an 'webpack-bundle-analyze' session against the production build of the client bundle.

## `yarn run analyze:server`

Creates an 'webpack-bundle-analyze' session against the production build of the server bundle.

## `yarn run build`

Builds the client and server bundles, with the output being optimized.

## `yarn run build:dev`

Builds the client and server bundles, with the output including development related code.

## `yarn run clean`

Deletes any build output that would have originated from the other commands.

## `yarn run deploy`

Deploys your application to [`now`](https://zeit.co/now). If you haven't heard of these guys, please check them out. They allow you to hit the ground running! I've included them within this repo as it requires almost zero configuration to allow your project to be deployed to their servers.

## `yarn run develop`

Starts a development server for both the client and server bundles.  We use `react-hot-loader` v3 to power the hot reloading of the client bundle, whilst a filesystem watch is implemented to reload the server bundle when any changes have occurred.

## `yarn run lint`

Executes `eslint` against the project. Alternatively you could look to install the `eslint-loader` and integrate it into the `webpack` bundle process.

## `yarn run start`

Executes the server.  It expects you to have already built the bundles using the `yarn run build` command.

## `yarn run test`

Runs the `jest` tests.

## `yarn run test:coverage`

Runs the `jest` tests and generates a coverage report. I recommend you look at [codecov.io](https://codecov.io) to host your coverage reports.
