 - [Project Overview](/docs/ProjectOverview.md)
 - [Application Configuration](/docs/ApplicationConfig.md)
 - [npm script commands](/docs/NPMCommands.md)
 - [Feature Branches](/docs/FeaturesBranches.md)
 - [Deploy your very own Server Side Rendering React App in 4 easy steps](/docs/DeployToNow.md)
 - __[FAQ](/docs/FAQ.md)__

# Frequently Asked Questions

___Q:___ __Why do you structure your dependencies like they are?__

The dependencies within `package.json` are structured so that the libraries required to transpile/bundle the source are contained within the `devDependencies` section, whilst the libraries required during the server runtime are contained within the `dependencies` section.

If you perform build tasks on your production environment you must ensure that you have allowed the installation of the `devDependencies` too (Heroku, for example doesn't do this by default).

There have been talks about creating a "dist" build, which would avoid target environment build steps however Webpack has an issue with bundle node_module dependencies if they include `require` statements using expressions/variables to resolve the module names.

___Q:___ __After adding a module that contains SASS/CSS (e.g. material-ui or bootstrap) the hot development server fails__

The development server has been configured to automatically generate a "Vendor DLL" containing all the modules that are used in your source.  We do this so that any rebuilds by Webpack are optimised as it need not bundle all your project's dependencies every time.  This works great most of the time, however, if you introduce a module that depends on one of your Webpack loaders (e.g. CSS/Images) then you need to make sure that you add the respective module to the vendor DLL ignores list within your project configuration.

For example, say you added `bootstrap` and were referencing the CSS file like so in your client bundle:

```js
import 'bootstrap/dist/css/bootstrap.css';
```

You would then need to edit `./config/private/project.js` and make the following adjustment:

```js
export default {
  ...
  bundles: {
    client: {
      ...,
      devVendorDLL: {
        ...,
        ignores: ['bootstrap/dist/css/bootstrap.css']
      }  
    },
    ...
  }
  ...
}
```

This ensures that the respective import will be ignored when generating the development "Vendor DLL" which means it will get processed by Webpack and included successfully in your project.

___Q:___ __My project fails to build and execute when I deploy it to my host__

The likely issue in this case, is that your hosting provider doesn't install the `devDependencies` by default.  The dependencies within `package.json` are structured so that the libraries required to transpile/bundle the source are contained within the `devDependencies` section, whilst the libraries required during the server runtime are contained within the `dependencies` section.
You two options to fix this:

 1. Prebuild your project and then deploy it along with the build output.
 2. Change your host configuration so that it will install the `devDependencies` too.  In the case of Heroku for example see [here](https://devcenter.heroku.com/articles/nodejs-support#devdependencies).

___Q:___ __How do I keep my project up to date with changes/fixes made on `react-universally`?__

This project wants to be a base starter kit allowing you to mould it as you like for each of your project's needs.  This comes with the trade off that updates/fixes will be more "involved" to apply.

One example workflow is:

```bash
# First clone this repo
git clone https://github.com/ctrlplusb/react-universally my-project

# Go into your project
cd my-project

# Now rename the "origin" git remote to "upstream"
git remote rename origin upstream

# I would then recommend creating a hosted repository for your
# project.

# Then add your newly created repository as the new "origin"
git remote add origin https://github.com/my-github-username/my-project

# Then push the master branch. This will also bind it to new
# "origin" remote.
git push -u origin master

# You can now code/commit/push to origin as normal.
# If you want to at some stage get new changes from the
# react-universally project, then do something like this:

# First fetch the latest changes
git fetch upstream

# Then merge them into your project
git merge upstream/master

# Deal with the merge conflicts, delete the yarn.lock file and
# rebuild it, then commit and push.
```
