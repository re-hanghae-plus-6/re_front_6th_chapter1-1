import { defineConfig } from "vite";

export default defineConfig({
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

  define: {
    "import.meta.env.PROD": JSON.stringify(process.env.NODE_ENV === "production"),
  },

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
});
