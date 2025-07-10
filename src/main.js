import { ProductListPage } from "./pages/productListPage.js";
import { store } from "./store.js";
import { ProductListController } from "./controllers/productListController.js";
import { ProductDetailController } from "./controllers/productDetailController.js";
import { CartModalController } from "./controllers/cartModalController.js";
import { router } from "./router.js";
import { actions } from "./actions/index.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let currentController = null;
let cartModalController = null;
let subscriptions = [];

function render() {
  if (router.currentRoute === "/" || !router.currentRoute) {
    const rootElement = document.body.querySelector("#root");
    if (rootElement) {
      rootElement.innerHTML = ProductListPage();
    }

    const state = store.getState();
    if (state.toast.isVisible) {
      setTimeout(() => {
        store.dispatch(actions.hideToast());
      }, 3000);
    }
  }
}

subscriptions.push(store.subscribe(render));

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

            currentController = new ProductListController();
            await currentController.initialize();

            if (router) {
              router.start();
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

function cleanupSubscriptions() {
  subscriptions.forEach((unsubscribe) => unsubscribe());
  subscriptions = [];
}

async function handleHome() {
  cleanupSubscriptions();

  if (currentController?.cleanup) {
    currentController.cleanup();
  }

  currentController = new ProductListController();
  await currentController.initialize();

  render(); // 초기 렌더링 추가
  subscriptions.push(store.subscribe(render));
  currentController.setupEventListeners();

  cartModalController = cartModalController || new CartModalController();
}

async function handleProductDetail(params) {
  cleanupSubscriptions();

  if (currentController?.cleanup) {
    currentController.cleanup();
  }

  currentController = new ProductDetailController(params.id);
  await currentController.initialize();

  cartModalController = cartModalController || new CartModalController();

  const { ProductDetailPage } = await import("./pages/productDetailPage.js");

  const renderProductDetail = async () => {
    const container = document.getElementById("root");
    const quantityInput = document.getElementById("quantity-input");
    const currentQuantity = quantityInput?.value || "1";

    if (container) {
      container.innerHTML = ProductDetailPage();

      const newQuantityInput = document.getElementById("quantity-input");
      if (newQuantityInput) {
        newQuantityInput.value = currentQuantity;
      }

      currentController.setupEventListeners();
      cartModalController.setupEventListeners();
    }
  };

  await renderProductDetail();
  subscriptions.push(store.subscribe(renderProductDetail));
}

async function handleNotFound() {
  cleanupSubscriptions();

  if (currentController?.cleanup) {
    currentController.cleanup();
  }
  currentController = null;

  if (cartModalController?.cleanup) {
    cartModalController.cleanup();
    cartModalController = null;
  }

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
