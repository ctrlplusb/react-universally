 - [Project Overview](/internal/docs/PROJECT_OVERVIEW.md)
 - [Project Configuration](/internal/docs/PROJECT_CONFIG.md)
 - [Package Script Commands](/internal/docs/PKG_SCRIPTS.md)
 - __[Feature Branches](/internal/docs/FEATURE_BRANCHES.md)__
 - [Deploy your very own Server Side Rendering React App in 5 easy steps](/internal/docs/DEPLOY_TO_NOW.md)
 - [FAQ](/internal/docs/FAQ.md)

# Feature Branches

Below are a list of extensions to this repository, in the form of branches.  Each of them has been tailored to add an individual technology.  It is possible to merge multiple branches together in order to create a technology mix that suits your project's needs.  We'll detail this workflow after the repository list.

 - [`apollo`](https://github.com/ctrlplusb/react-universally/tree/feature/apollo) - Adds the Apollo Stack (i.e. Graphql).
 - [`flow`](https://github.com/ctrlplusb/react-universally/tree/feature/flow) - Adds static type checking using Flow.
 - [`found`](https://github.com/andreyluiz/react-universally/tree/feature/found) - Adds the Found router in replacement to react-router.
 - [`glamor`](https://github.com/ctrlplusb/react-universally/tree/feature/glamor) - Adds the Glamor CSS-in-JS library.
 - [`koa2`](https://github.com/ctrlplusb/react-universally/tree/feature/koa2) - Replaces Express with Koa2.
 - [`jest`](https://github.com/ctrlplusb/react-universally/tree/feature/jest) - Adds the Jest testing framework.
 - [`mobx`](https://github.com/andreyluiz/react-universally/tree/feature/mobx) - Adds MobX as a state management library.
 - [`preact`](https://github.com/andreyluiz/react-universally/tree/feature/preact) - Replaces React with Preact via `preact-compat` a React polyfill that uses Preact under the hood. Smaller, faster.
 - [`postcss-sass`](https://github.com/ctrlplusb/react-universally/tree/feature/postcss-sass) - Adds PostCSS and SASS.
 - [`redux-opinionated`](https://github.com/ctrlplusb/react-universally/tree/feature/redux-opinionated) - Adds an opinionated Redux implementation, using `redux-thunk` and `react-jobs` to support data loading across the client/server.  It also merges in the `flow` feature branch.
 - [`styled-components`](https://github.com/ctrlplusb/react-universally/tree/feature/styled-components) - Adds the Styled Components CSS-in-JS library.
 - [`styletron`](https://github.com/ctrlplusb/react-universally/tree/feature/styletron) - Adds the Styletron CSS-in-JS library.

If you would like to add a new feature branch log an issue describing your chosen technology and we can come up with a plan together. :)

## An example workflow

Ok, so how do you go about creating a repo that uses a mix mash of these feature branches? Well, say you wanted a combo of `apollo` and `styletron`, you could do the following:

> _NOTE:_ Merging the yarn.lock file is messy in my opinion. I rather select "merge all" from "theirs" or "ours" and then after the merge I delete the yarn.lock file and run the `yarn` command to rebuild it properly.

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

# Ok, so now you need to choose and merge each feature branch.

# -------------------------------------------------------------
# First up, apollo:

# First fetch the latest changes from the upstream
git fetch upstream

# Then merge the apollo branch into your project
git merge upstream/feature/apollo

# Deal with the merge conflicts, delete the yarn.lock file and
# rebuild it, then commit and push.

# -------------------------------------------------------------
# Next, styletron:

# First fetch the latest changes from the upstream
git fetch upstream

# Then merge the styletron branch into your project
git merge upstream/feature/styletron

# Deal with the merge conflicts, delete the yarn.lock file and
# rebuild it, then commit and push.

# --------------------------------------------------------------

# You now have an apollo SSR app with styletron powered styles!

# Any time you want to pull changes from one of the branches
# simply repeat:
git fetch upstream
git merge upstream/feature/FEATURENAME
# deal with conflicts, rebuild yarn.lock, commit, push
```
