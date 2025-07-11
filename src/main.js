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

  let lastRoute = null;

  store.subscribe(async (state) => {
    if (state.currentRoute !== lastRoute) {
      lastRoute = state.currentRoute;
      await controller.handleRouteChange(state.currentRoute);
    }

    render();
  });

  const urlParams = new URLSearchParams(window.location.search);
  const redirectPath = urlParams.get("redirect");

  let initialPath;
  if (redirectPath) {
    initialPath = redirectPath;
    window.history.replaceState({}, "", redirectPath);
  } else {
    initialPath = location.pathname;
  }

  store.dispatch(actions.navigate(initialPath));
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
