import { ProductListPage } from "./pages/productListPage.js";
import { store } from "./store.js";
import { ProductListController } from "./controllers/productListController.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let currentController = null;

function render() {
  const state = store.getState();
  document.body.querySelector("#root").innerHTML = ProductListPage(state);
}

store.subscribe(render);

if (import.meta.env.MODE === "test") {
  const observer = new MutationObserver((mutations) => {
    try {
      if (typeof document === "undefined" || !document.body) {
        return;
      }

      mutations.forEach(async (mutation) => {
        if (mutation.type === "childList") {
          const rootElement = document.body.querySelector("#root");
          if (rootElement && rootElement.innerHTML === "") {
            store.reset();
            if (currentController) {
              await currentController.initialize();
            }
          }
        }
      });
    } catch (error) {
      console.warn(error.message);
    }
  });

  if (typeof document !== "undefined" && document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

async function main() {
  currentController = new ProductListController();
  await currentController.initialize();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
