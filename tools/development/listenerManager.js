/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */

class ListenerManager {
  constructor(listener) {
    this.lastConnectionKey = 0;
    this.connectionMap = {};
    this.listener = listener;

    // Track all connections to our server so that we can close them when needed.
    this.listener.on('connection', (connection) => {
      // Generate a new key to represent the connection
      const connectionKey = this.lastConnectionKey + 1;
      // Add the connection to our map.
      this.connectionMap[connectionKey] = connection;
      // Remove the connection from our map when it closes.
      connection.on('close', () => {
        delete this.connectionMap[connectionKey];
      });
    });
  }

  killAllConnections() {
    Object.keys(this.connectionMap).forEach((connectionKey) => {
      this.connectionMap[connectionKey].destroy();
    });
  }

  dispose(force = false) {
    return new Promise((resolve) => {
      // if (force) {
      //   // Forcefully close any existing connections.
      //   this.killAllConnections();
      // }

      // Close the listener.
      if (this.listener) {
        this.listener.close(() => {
          // Ensure no straggling connections are left over.
          this.killAllConnections();

          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = ListenerManager;
