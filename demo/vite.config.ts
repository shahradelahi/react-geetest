import nodeAdapter from '@hono/vite-dev-server/node';
import devServer from '@hono/vite-dev-server';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    devServer({
      adapter: nodeAdapter(),
      entry: 'src/server.ts',
      exclude: [
        /^\/$/,
        /^\/(index\.html|src\/.*|node_modules\/.*|@vite\/.*|@react-refresh|@fs\/.*)$/,
      ],
    }),
  ],
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
