import { App } from "./App.js";
import { store } from "./store.js";
import { actions } from "./actions/index.js";
import { controller } from "./controllers";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function render() {
  const rootElement = document.body.querySelector("#root");
  if (rootElement) {
    rootElement.innerHTML = App();
  }
}

async function main() {
  await controller.initialize();

  store.subscribe(() => {
    render();
  });

  window.addEventListener("popstate", async () => {
    const pathname = location.pathname;
    store.dispatch(actions.navigate(pathname));
    await controller.handleRouteChange(pathname);
  });

  const initialPath = location.pathname;
  store.dispatch(actions.navigate(initialPath));
  await controller.handleRouteChange(initialPath);
  render();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
