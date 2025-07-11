import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  // GitHub Pages 배포를 위한 base 경로 설정
  base: process.env.NODE_ENV === "production" ? "/front_6th_chapter1-1/" : "/",

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
