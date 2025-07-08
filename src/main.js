import { ProductListPage } from "./pages/productListPage.js";
import { store } from "./store.js";
import { ProductListController } from "./controllers/productListController.js";
import { ProductDetailController } from "./controllers/productDetailController.js";
import { router } from "./router.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let currentController = null;

function render() {
  if (router.currentRoute === "/" || !router.currentRoute) {
    const state = store.getState();
    const rootElement = document.body.querySelector("#root");
    if (rootElement) {
      rootElement.innerHTML = ProductListPage(state);
    }
  }
}

store.subscribe(render);

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-link]");
  if (link) {
    event.preventDefault();
    const href = link.getAttribute("href");
    if (href) {
      router.navigate(href);
    }
  }
});

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
            if (currentController && typeof currentController.cleanup === "function") {
              currentController.cleanup();
            }
            currentController = null;
            store.reset();

            if (router) {
              router.handleRouteChange();
            } else {
              currentController = new ProductListController();
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

async function handleHome() {
  if (currentController && currentController.constructor.name !== "ProductListController") {
    if (typeof currentController.cleanup === "function") {
      currentController.cleanup();
    }
    currentController = null;
  }

  if (!currentController) {
    currentController = new ProductListController();
    await currentController.initialize();
  }
}

async function handleProductDetail(params) {
  if (currentController && typeof currentController.cleanup === "function") {
    currentController.cleanup();
  }
  currentController = null;

  currentController = new ProductDetailController(params.id);
  await currentController.initialize();

  const renderProductDetail = async () => {
    const state = store.getState();
    const { ProductDetailPage } = await import("./pages/productDetailPage.js");

    const container = document.getElementById("root");
    if (container) {
      container.innerHTML = ProductDetailPage({
        product: state.productDetail.product,
        relatedProducts: state.productDetail.relatedProducts,
        loading: state.productDetail.loading,
      });
    }
  };

  await renderProductDetail();

  const unsubscribe = store.subscribe(() => {
    renderProductDetail();
  });

  const originalCleanup = currentController.cleanup.bind(currentController);
  currentController.cleanup = () => {
    unsubscribe();
    originalCleanup();
  };
}

async function handleNotFound() {
  if (currentController && typeof currentController.cleanup === "function") {
    currentController.cleanup();
  }
  currentController = null;

  const { NotFoundPage } = await import("./pages/notFoundPage.js");

  const container = document.getElementById("root");
  if (container) {
    container.innerHTML = NotFoundPage();
  }
}

async function main() {
  router.addRoute("/", handleHome);
  router.addRoute("/product/:id", handleProductDetail);
  router.setNotFoundHandler(handleNotFound);
  router.start();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
