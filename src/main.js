import App from "./App.js";

export const BASE = process.env.NODE_ENV === "production" ? "/front_6th_chapter1-1/" : "/";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${BASE.slice(0, -1)}/mockServiceWorker.js`,
      },
    }),
  );

function main() {
  App();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
