 - [Feature Branches](/docs/FeaturesBranches.md)
 - [Application Configuration](/docs/ApplicationConfig.md)
 - __[Security](/docs/Security.md)__
 - [Project Structure](/docs/ProjectStructure.md)
 - [Deploy your very own Server Side Rendering React App in 4 easy steps](/docs/DeployToNow.md)
 - [npm script commands](/docs/NPMCommands.md)
 - [FAQ](/docs/FAQ.md)

# Security

This file gives an overview of the security baked into the project.

## Express Server

We make use of the `helmet` and `hpp` middleware libraries to provide a fairly advanced security configuration for our express server, attempting to follow best practices. If you are unfamiliar with CSPs then I highly recommend that you do some reading on the subject:

  - https://content-security-policy.com/
  - https://developers.google.com/web/fundamentals/security/csp/
  - https://developer.mozilla.org/en/docs/Web/Security/CSP
  - https://helmetjs.github.io/docs/csp/

If you are relying on scripts/styles/assets from CDN or from any other server/application that is not hosted on the same URL as your application then you will need to explicitly add the respective CSN/Server URLs to the Content Security Policy within the express configuration.  For example you can see I have had to add the polyfill.io CDN in order to allow us to use the polyfill script.

You may find CSPs annoying at first, but it is a great habit to build. The CSP configuration is an optional item for helmet, however you should not remove it without making a serious consideration that you do not require the added security.
