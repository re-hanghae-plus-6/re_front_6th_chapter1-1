import { router } from "./router.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

async function main() {
  window.addEventListener("popstate", router);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      router();
    });
  } else {
    router();
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
