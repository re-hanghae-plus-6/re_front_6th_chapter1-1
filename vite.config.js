import { defineConfig } from "vitest/config";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  define: {
    "import.meta.env.BASE_URL": JSON.stringify(isProd ? "/front_6th_chapter1-1/" : "/"),
    "import.meta.env.MODE": JSON.stringify(process.env.NODE_ENV),
  },
  base: isProd ? "/front_6th_chapter1-1/" : undefined,
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        entryFileNames: "assets/main-[hash].js",
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
