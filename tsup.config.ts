import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  sourcemap: true,
  target: 'esnext',
  outDir: 'dist',
});
