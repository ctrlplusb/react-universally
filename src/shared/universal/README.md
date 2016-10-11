# src/shared/universal

This directory should contain code that is considered safe to execute on a `node` or `web` target bundle.

This means all our bundles:
 - src/server
 - src/universalMiddleware
 - src/client

The bundles at these locations can safely consume this code.
