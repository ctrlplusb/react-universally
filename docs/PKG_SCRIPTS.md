 - [Project Overview](/docs/PROJECT_OVERVIEW.md)
 - [Application Configuration](/docs/APPLICATION_CONFIG.md)
 - __[Package Script Commands](/docs/PKG_SCRIPTS.md)__
 - [Feature Branches](/docs/FEATURE_BRANCHES.md)
 - [Deploy your very own Server Side Rendering React App in 4 easy steps](/docs/DEPLOY_TO_NOW.md)
 - [FAQ](/docs/FAQ.md)

# Package Scripts

## `yarn run development`

Starts a development server for both the client and server bundles.  We use `react-hot-loader` v3 to power the hot reloading of the client bundle, whilst a filesystem watch is implemented to reload the server bundle when any changes have occurred.

## `yarn run build`

Builds the client and server bundles, with the output being production optimised.

## `yarn run start`

Executes the server.  It expects you to have already built the bundles either via the `yarn run build` command or manually.

## `yarn run clean`

Deletes any build output that would have originated from the other commands.

## `yarn run deploy`

Deploys your application to [`now`](https://zeit.co/now). If you haven't heard of these guys, please check them out. They allow you to hit the ground running! I've included them within this repo as it requires almost zero configuration to allow your project to be deployed to their servers.

## `yarn run lint`

Executes `eslint` (using the Airbnb config) against the src folder. Alternatively you could look to install the `eslint-loader` and integrate it into the `webpack` bundle process.

## `yarn run analyze`

Creates an 'webpack-bundle-analyze' session against the production build of the client bundle.  This is super handy for figuring out just exactly what dependencies are being included within your bundle.  Try clicking around, it's an awesome tool.
