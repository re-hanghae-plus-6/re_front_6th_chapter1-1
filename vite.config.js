import { defineConfig } from "vitest/config";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  base: isProd ? "/front_6th_chapter1-1/" : undefined,
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      input: "/src/main.js",
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
    testTimeout: 10000,
  },
});
