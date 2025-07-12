import { defineConfig } from "vitest/config";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/front_6th_chapter1-1/" : "/",
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

// import { defineConfig } from "vitest/config";

// // GitHub Actions에서는 base 고정
// const isCI = process.env.GITHUB_ACTIONS === "true";

// export default defineConfig({
//   base: isCI ? "/front_6th_chapter1-1/" : "/",

//   build: {
//     outDir: "dist",
//     assetsDir: "assets",
//     sourcemap: false,
//     // ❗ rollup을 명시적으로 지정하여 rolldown 사용하지 않게 하기
//     target: "esnext",
//     minify: true,
//     // 아래 줄이 핵심: rollup 사용 선언
//     // 이 줄이 없으면 Vite 5에서 rolldown으로 전환됨
//     buildLib: false, // 라이브러리 모드 방지
//   },

//   test: {
//     globals: true,
//     environment: "jsdom",
//     setupFiles: "./src/setupTests.js",
//     exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
//     poolOptions: {
//       threads: {
//         singleThread: true,
//       },
//     },
//   },
// });
