import { defineConfig } from 'vitest/config';

export default defineConfig({
  // GitHub Pages 배포를 위한 base path 설정
  // 레포지토리 이름으로 변경하세요 (예: /your-repo-name/)
  base: process.env.NODE_ENV === 'production' ? '/front_6th_chapter1-1/' : '/',

  // 빌드 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // SPA를 위한 설정
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
  server: {
    // SPA 라우팅 지원을 위한 히스토리 API 설정
    historyApiFallback: true,
  },
});
