import { defineConfig } from 'vitest/config';

export default defineConfig({
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
  server: {
    // SPA 라우팅 지원을 위한 히스토리 API 설정
    historyApiFallback: true,
  },
});
