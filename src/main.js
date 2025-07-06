import { createApp } from "./app.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

async function main() {
  const app = createApp();
  await app.init();
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
