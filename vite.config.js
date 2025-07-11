import { defineConfig } from "vitest/config";

export default defineConfig(() => {
  const isCI = !!process.env.GITHUB_ACTIONS;
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
  return {
    base: isCI ? `/${repo}/` : "/",
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
  };
});
