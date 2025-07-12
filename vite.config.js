import { defineConfig } from "vitest/config";
import fs from "fs";
import path from "path";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/front_6th_chapter1-1/" : "/",
  plugins: [
    {
      name: "generate-404",
      writeBundle() {
        if (process.env.NODE_ENV === "production") {
          const distPath = path.resolve("dist");
          const indexPath = path.join(distPath, "index.html");
          const notFoundPath = path.join(distPath, "404.html");

          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, notFoundPath);
            console.log("✓ 404.html generated for GitHub Pages");
          }
        }
      },
    },
  ],
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
