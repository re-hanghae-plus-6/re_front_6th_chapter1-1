import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    fs: {
      strict: false,
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
});
