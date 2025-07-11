import Home from "./pages/Home.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

async function main() {
  const $app = document.createElement("div");
  $app.id = "app";
  document.body.appendChild($app);

  new Home({ $target: $app });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
