 - [Feature Branches](/FeaturesBranches.md)
 - [Application Configuration](/ApplicationConfig.md)
 - [Security](/Security.md)
 - __[Project Structure](/ProjectStructure.md)__
 - [Deploy your very own Server Side Rendering React App in 4 easy steps](/DeployToNow.md)
 - [npm script commands](/NPMCommands.md)
 - [FAQ](/FAQ.md)

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
