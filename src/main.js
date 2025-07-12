import { createRouter } from "./router/create-router";
import { initSearchParamsListener } from "../src/features/common/search-params/search-params-store";

const main = () => {
  createRouter();
  initSearchParamsListener();
};

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
