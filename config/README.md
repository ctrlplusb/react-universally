# Centralised Project Configuration

We have split this into public/private folders to indicate which files are sensitive or not.

Anything in the public folder can be safely imported into our client bundle without concern.

Note: if you see the bundle configuration for each bundle (in ./config/private/project.js) you will notice the src paths have been explicitly stated for each bundle.  The "client" bundle only has the "./config/public" folder exposed to it, so even if you try to import the private config the bundling process will fail.
