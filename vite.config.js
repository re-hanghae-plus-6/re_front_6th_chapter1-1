import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: process.env.MODE === 'production' ? '/front_6th_chapter1-1' : '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    exclude: ['**/e2e/**', '**/*.e2e.spec.js', '**/node_modules/**'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
