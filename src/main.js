import { initializeApp } from "./core/app.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(initializeApp);
} else {
  initializeApp();
}
