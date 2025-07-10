import { ProductListController } from "./productListController.js";
import { ProductDetailController } from "./productDetailController.js";
import { CartModalController } from "./cartModalController.js";
import { getProductId } from "../utils/urlUtils.js";
import { store } from "../store.js";
import { actions } from "../actions/index.js";

class Controller {
  constructor() {
    this.controllers = {
      productList: null,
      productDetail: null,
      cartModal: null,
    };
  }

  async initialize() {
    this.setupGlobalEventListeners();
  }

  setupGlobalEventListeners() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-link]");
      if (link) {
        event.preventDefault();
        const href = link.getAttribute("href");
        if (href) {
          store.dispatch(actions.navigate(href));
        }
      }
    });
  }

  async handleRouteChange(currentRoute) {
    if (currentRoute === "/" || !currentRoute) {
      if (!this.controllers.productList) {
        this.controllers.productList = new ProductListController();
        this.controllers.productList.setupEventListeners();
      }
      await this.controllers.productList.loadInitialData();
    } else if (currentRoute.startsWith("/product/")) {
      const productId = getProductId(currentRoute);
      if (productId) {
        if (!this.controllers.productDetail) {
          this.controllers.productDetail = new ProductDetailController();
          this.controllers.productDetail.setupEventListeners();
        }
        await this.controllers.productDetail.loadProduct(productId);
      }
    }

    if (!this.controllers.cartModal) {
      this.controllers.cartModal = new CartModalController();
      this.controllers.cartModal.setupEventListeners();
    }
  }

  cleanup() {
    if (this.controllers.productList) {
      this.controllers.productList.cleanup();
      this.controllers.productList = null;
    }
    if (this.controllers.productDetail) {
      this.controllers.productDetail.cleanup();
      this.controllers.productDetail = null;
    }
    if (this.controllers.cartModal) {
      this.controllers.cartModal.cleanup();
      this.controllers.cartModal = null;
    }
  }
}

export const controller = new Controller();
