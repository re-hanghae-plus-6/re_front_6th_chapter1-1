import { App } from "./app.js";
import { store } from "./store.js";
import { actions } from "./actions/index.js";
import { controller } from "./controllers";

const enableMocking = async () => {
  try {
    const { worker } = await import("./mocks/browser.js");
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/front_6th_chapter1-1/mockServiceWorker.js",
      },
    });
  } catch (error) {
    console.warn("MSW를 시작할 수 없습니다:", error);
  }
};

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
