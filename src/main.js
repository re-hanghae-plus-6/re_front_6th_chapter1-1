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
    render(); // 라우트 변경 시작 시 즉시 렌더링
    await controller.handleRouteChange(location.pathname);
    isHandlingRouteChange = false;
    // store.subscribe가 자동으로 렌더링 처리
  });

  store.dispatch(actions.navigate(location.pathname));
  render();
  isHandlingRouteChange = true;
  await controller.handleRouteChange(location.pathname);
  isHandlingRouteChange = false;
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
