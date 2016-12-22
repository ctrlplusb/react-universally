 - [Feature Branches](/docs/FeaturesBranches.md)
 - [Application Configuration](/docs/ApplicationConfig.md)
 - [Security](/docs/Security.md)
 - __[Project Structure](/docs/ProjectStructure.md)__
 - [Deploy your very own Server Side Rendering React App in 4 easy steps](/docs/DeployToNow.md)
 - [npm script commands](/docs/NPMCommands.md)
 - [FAQ](/docs/FAQ.md)

# Project Structure

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
