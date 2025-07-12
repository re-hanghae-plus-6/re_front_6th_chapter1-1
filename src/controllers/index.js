import { ProductListController } from "./productListController.js";
import { ProductDetailController } from "./productDetailController.js";
import { CartModalController } from "./cartModalController.js";
import { getProductId } from "../utils/urlUtils.js";
import { store } from "../store.js";
import { actions } from "../actions/index.js";
import { clearCartStorage } from "../utils/storage.js";

class Controller {
  constructor() {
    this.controllers = {
      productList: null,
      productDetail: null,
      cartModal: null,
    };
    this.globalEventListeners = [];
  }

  async initialize() {
    this.setupGlobalEventListeners();

    if (!this.controllers.cartModal) {
      this.controllers.cartModal = new CartModalController();
      this.controllers.cartModal.setupEventListeners();
    }
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  setupGlobalEventListeners() {
    this.cleanupGlobalEventListeners();

    const clickHandler = (event) => {
      const link = event.target.closest("a[data-link]");
      if (link) {
        event.preventDefault();
        const href = link.getAttribute("href");
        if (href) {
          store.dispatch(actions.navigate(href));
        }
      }

      const toastCloseBtn = event.target.closest("#toast-close-btn");
      if (toastCloseBtn) {
        event.preventDefault();
        store.dispatch(actions.hideToast());
      }

      if (event.target.id === "cart-icon-btn" || event.target.closest("#cart-icon-btn")) {
        this.#handleCartIconClick(event);
      }
    };

    const popstateHandler = () => {
      const basePath = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";
      let currentPath = location.pathname;

      if (basePath && currentPath.startsWith(basePath)) {
        currentPath = currentPath.slice(basePath.length) || "/";
      }

      if (import.meta.env.MODE === "test" && currentPath === "/" && this.resetLastRoute) {
        this.resetLastRoute();
      }

      store.dispatch(actions.navigate(currentPath));
    };

    document.addEventListener("click", clickHandler);
    window.addEventListener("popstate", popstateHandler);

    this.globalEventListeners.push(
      { element: document, type: "click", handler: clickHandler, useCapture: false },
      { element: window, type: "popstate", handler: popstateHandler },
    );
  }

  #handleCartIconClick(event) {
    event.preventDefault();
    store.dispatch(actions.showCartModal());
  }

  cleanupGlobalEventListeners() {
    this.globalEventListeners.forEach(({ element, type, handler, useCapture }) => {
      element.removeEventListener(type, handler, useCapture);
    });
    this.globalEventListeners = [];
  }

  async handleRouteChange(currentRoute) {
    if (currentRoute === "/" || !currentRoute) {
      if (import.meta.env.MODE === "test") {
        if (this.controllers.productList) {
          this.controllers.productList.cleanup();
          this.controllers.productList = null;
        }
        if (this.controllers.productDetail) {
          this.controllers.productDetail.cleanup();
          this.controllers.productDetail = null;
        }

        clearCartStorage();
        store.reset();
        store.computed.cart.clearCache();

        const rootElement = document.getElementById("root");
        if (rootElement) {
          rootElement.innerHTML = "";
        }
      }

      store.dispatch(actions.loadInitialData());

      if (this.controllers.productList) {
        this.controllers.productList.cleanup();
      }
      this.controllers.productList = new ProductListController();
      this.controllers.productList.setupEventListeners();

      requestAnimationFrame(() => {
        this.controllers.productList.loadData();
      });
    } else if (currentRoute.startsWith("/product/")) {
      const productId = getProductId(currentRoute);
      if (productId) {
        if (!this.controllers.productDetail) {
          this.controllers.productDetail = new ProductDetailController();
          this.controllers.productDetail.setupEventListeners();
        }

        // 화면 렌더링 후 데이터 로드
        requestAnimationFrame(() => {
          this.controllers.productDetail.loadProduct(productId);
        });
      }
    }

    if (!this.controllers.cartModal) {
      this.controllers.cartModal = new CartModalController();
      this.controllers.cartModal.setupEventListeners();
    }
  }

  cleanupCurrentControllers() {
    if (this.controllers.productList) {
      this.controllers.productList.cleanup();
      this.controllers.productList = null;
    }
    if (this.controllers.productDetail) {
      this.controllers.productDetail.cleanup();
      this.controllers.productDetail = null;
    }
  }

  cleanup() {
    this.cleanupCurrentControllers();
    this.cleanupGlobalEventListeners();

    if (this.controllers.cartModal) {
      this.controllers.cartModal.cleanup();
      this.controllers.cartModal = null;
    }
  }
}

export const controller = new Controller();
