# Adding an "API" Bundle

A fairly common requirement for a project that scales is to create additional servers bundles, e.g. an API server.

Instead of requiring you to hack the Webpack configuration we have have provided a section within the centralised project configuration that allows you to easily declare additional bundles.  You simply need to provide the source, entry, and output paths - we take care of the rest.  

_IMPORTANT:_ One further requirement for this feature is that within your new server bundle you export the created http listener.  This exported listener will be used by the development server so that it can automatically restart your server any time the source files for it change.
