// We use the offline-plugin to generate a service worker.  See the webpack
// config for more details.
//
// We need to ensure that the runtime is installed so that the generated
// service worker is executed.
//
// We will only be doing this for production builds.

import { safeConfigGet } from '../shared/utils/config';

if (process.env.NODE_ENV === 'production') {
  // We check the shared config, ensuring that the service worker has been
  // enabled.
  if (safeConfigGet(['serviceWorker', 'enabled'])) {
    const OfflinePluginRuntime = require('offline-plugin/runtime');

    // Install the offline plugin, which instantiates our service worker and app
    // cache to support precaching of assets and offline support.
    OfflinePluginRuntime.install({
      onUpdating: () => undefined,
      // When an update is ready we will tell the new SW to take control immediately.
      onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
      // After the new SW update has been applied we will reload the users page
      // to ensure they are using the latest assets.
      // This only gets run if there were updates available for our cached assets.
      onUpdated: () => window.location.reload(),
      onUpdateFailed: () => undefined,
    });
  }
}
