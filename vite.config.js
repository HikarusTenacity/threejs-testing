const { defineConfig } = require('vite');

module.exports = defineConfig({
  server: {
    watch: {
      ignored: ['!**/public/game.bundle.js']
    }
  },
  plugins: [
    {
      name: 'reload-on-game-bundle-change',
      configureServer(server) {
        server.watcher.add('public/game.bundle.js');
        server.watcher.on('change', (file) => {
          if (file.endsWith('public/game.bundle.js')) {
            server.ws.send({ type: 'full-reload' });
          }
        });
      }
    }
  ]
});
