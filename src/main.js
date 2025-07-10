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

let subscriptions = [];

function render() {
  const rootElement = document.body.querySelector("#root");
  if (rootElement) {
    rootElement.innerHTML = App();
  }
}

async function main() {
  await controller.initialize();

  let isHandlingRouteChange = false;

  subscriptions.push(
    store.subscribe(async () => {
      if (isHandlingRouteChange) return;
      render();
    }),
  );

  window.addEventListener("popstate", async () => {
    isHandlingRouteChange = true;
    store.dispatch(actions.navigate(location.pathname));
    await controller.handleRouteChange(location.pathname);
    isHandlingRouteChange = false;
  });

  isHandlingRouteChange = true;
  store.dispatch(actions.navigate(location.pathname));
  await controller.handleRouteChange(location.pathname);
  isHandlingRouteChange = false;
  render();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
