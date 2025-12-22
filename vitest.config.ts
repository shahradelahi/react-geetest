import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 20000,
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
