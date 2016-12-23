 - [Project Overview](/docs/ProjectOverview.md)
 - [Application Configuration](/docs/ApplicationConfig.md)
 - __[npm script commands](/docs/NPMCommands.md)__
 - [Feature Branches](/docs/FeaturesBranches.md)
 - [Deploy your very own Server Side Rendering React App in 4 easy steps](/docs/DeployToNow.md)
 - [FAQ](/docs/FAQ.md)

# NPM Commands

## `npm run development`

Starts a development server for both the client and server bundles.  We use `react-hot-loader` v3 to power the hot reloading of the client bundle, whilst a filesystem watch is implemented to reload the server bundle when any changes have occurred.

## `npm run build`

Builds the client and server bundles, with the output being production optimised.

## `npm run start`

Executes the server.  It expects you to have already built the bundles either via the `npm run build` command or manually.

## `npm run clean`

Deletes any build output that would have originated from the other commands.

## `npm run deploy`

Deploys your application to [`now`](https://zeit.co/now). If you haven't heard of these guys, please check them out. They allow you to hit the ground running! I've included them within this repo as it requires almost zero configuration to allow your project to be deployed to their servers.

## `npm run lint`

Executes `eslint` (using the Airbnb config) against the src folder. Alternatively you could look to install the `eslint-loader` and integrate it into the `webpack` bundle process.

## `npm run analyze`

Creates an 'webpack-bundle-analyze' session against the production build of the client bundle.  This is super handy for figuring out just exactly what dependencies are being included within your bundle.  Try clicking around, it's an awesome tool.

## `npm run flow`

Executes `flow-bin`, performing flow based type checking on the source.  If you really like flow I would recommend getting a plugin for your IDE.  For Atom I recommend `flow-ide`.

## `npm run flow:defs`

Installs the flow type definitions for the projects dependencies from the official "flow-typed" repository.

## `npm run flow:report`

Executes `flow-coverage-report`, generating a report on your type check coverage.  It returns with an error if your coverage is below 80%.  After you have run it I recommend clicking into the generated flow-coverage directory and opening the HTML report.  You can click through into files to see where your coverage is lacking.

## `npm run flow:remove`

For those of us not wanting to use `flow`. Running this command removes everything `flow` related from the project.  It's best to run this against a fresh clone of the project, but it should work fine with a project that has been extended somewhat.

__Warning:__ This is a destructive behaviour - it modifies your actual source files. Please make sure you commit any existing changes to your src before running this command.
