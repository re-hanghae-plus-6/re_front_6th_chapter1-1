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

function render() {
  if (router.currentRoute === "/" || !router.currentRoute) {
    const state = store.getState();
    const rootElement = document.body.querySelector("#root");
    if (rootElement) {
      rootElement.innerHTML = ProductListPage({
        ...state,
        cartComputed: store.computed.cart,
      });
    }

    if (state.toast.isVisible) {
      setTimeout(() => {
        store.dispatch(actions.hideToast());
      }, 3000);
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

    currentController.setupEventListeners();
  }

  if (!cartModalController) {
    cartModalController = new CartModalController();
  }
}

async function handleProductDetail(params) {
  if (currentController && typeof currentController.cleanup === "function") {
    currentController.cleanup();
  }
  currentController = null;

  currentController = new ProductDetailController(params.id);
  await currentController.initialize();

  if (!cartModalController) {
    cartModalController = new CartModalController();
  }

  const renderProductDetail = async () => {
    const state = store.getState();
    const { ProductDetailPage } = await import("./pages/productDetailPage.js");

    const container = document.getElementById("root");
    if (container) {
      container.innerHTML = ProductDetailPage({
        productDetail: state.productDetail,
        toast: state.toast,
        cartComputed: store.computed.cart,
        cart: state.cart,
      });
    }
  };

  await renderProductDetail();

  currentController.setupEventListeners();
  if (cartModalController) {
    cartModalController.setupEventListeners();
  }

  const unsubscribe = store.subscribe(async () => {
    const quantityInput = document.getElementById("quantity-input");
    const currentQuantity = quantityInput ? quantityInput.value : "1";

    await renderProductDetail();

    const newQuantityInput = document.getElementById("quantity-input");
    if (newQuantityInput && currentQuantity) {
      newQuantityInput.value = currentQuantity;
    }

    currentController.setupEventListeners();
    if (cartModalController) {
      cartModalController.setupEventListeners();
    }
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

  if (cartModalController && typeof cartModalController.cleanup === "function") {
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
