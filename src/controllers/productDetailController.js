import { store } from "../store.js";
import { actions } from "../actions/index.js";
import { getProduct, getProducts } from "../api/productApi.js";

export class ProductDetailController {
  #productId;
  #eventListeners = [];
  #quantity = 1;

  constructor(productId) {
    this.#productId = productId;
  }

  get state() {
    return store.getState();
  }

  async initialize() {
    await this.loadProductDetail();
  }

  setupEventListeners() {
    this.#removeEventListeners();
    this.#setupEventListeners();
  }

  #removeEventListeners() {
    this.#eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.#eventListeners = [];
  }

  async loadProduct(productId) {
    this.#productId = productId;
    await this.loadProductDetail();
  }

  async loadProductDetail() {
    store.dispatch(actions.loadProductDetail());

    try {
      const product = await getProduct(this.#productId);
      store.dispatch(actions.productDetailLoaded(product));
      this.#quantity = 1;

      await this.#loadRelatedProducts(product);
    } catch (error) {
      console.error("상품 상세 정보 로딩 실패:", error);
      store.dispatch(actions.loadProductDetailError(error.message));
    }
  }

  async #loadRelatedProducts(product) {
    if (!product || !product.category1) return;

    store.dispatch(actions.loadRelatedProducts());

    try {
      const relatedData = await getProducts({
        category1: product.category1,
        category2: product.category2,
      });

      const relatedProducts = relatedData.products.filter(
        (product) => product.productId !== this.#productId && product.productId !== this.#productId,
      );

      store.dispatch(actions.relatedProductsLoaded(relatedProducts));
    } catch (error) {
      console.error("관련 상품 로딩 실패:", error);
    }
  }

  #setupEventListeners() {
    const clickHandler = (event) => {
      if (event.target.closest(".cart-modal")) {
        return;
      }

      if (event.target.id === "quantity-decrease") {
        this.#handleQuantityDecrease();
        return;
      }

      if (event.target.id === "quantity-increase") {
        this.#handleQuantityIncrease();
        return;
      }

      if (event.target.id === "add-to-cart-btn") {
        this.#handleAddToCart();
        return;
      }

      if (event.target.classList.contains("breadcrumb-link")) {
        this.#handleBreadcrumbClick(event);
        return;
      }

      if (event.target.classList.contains("go-to-product-list")) {
        this.#handleGoToProductList();
        return;
      }

      if (event.target.closest("#cart-icon-btn")) {
        this.#handleCartIconClick();
        return;
      }

      const relatedProductCard = event.target.closest(".related-product-card");
      if (relatedProductCard) {
        this.#handleRelatedProductClick(relatedProductCard);
        return;
      }
    };

    const changeHandler = (event) => {
      if (event.target.id === "quantity-input") {
        this.#handleQuantityInput(event);
      }
    };

    document.addEventListener("click", clickHandler);
    document.addEventListener("change", changeHandler);

    this.#eventListeners.push(
      { element: document, type: "click", handler: clickHandler },
      { element: document, type: "change", handler: changeHandler },
    );
  }

  #handleQuantityDecrease() {
    const quantityInput = document.getElementById("quantity-input");
    if (quantityInput) {
      const currentQuantity = parseInt(quantityInput.value) || 1;
      const newQuantity = Math.max(1, currentQuantity - 1);
      quantityInput.value = newQuantity;
      this.#quantity = newQuantity;
    }
  }

  #handleQuantityIncrease() {
    const { productDetail } = this.state;
    const product = productDetail.product;
    const maxStock = product?.stock || 999;

    const quantityInput = document.getElementById("quantity-input");
    if (quantityInput) {
      const currentQuantity = parseInt(quantityInput.value) || 1;
      const newQuantity = Math.min(maxStock, currentQuantity + 1);
      quantityInput.value = newQuantity;
      this.#quantity = newQuantity;
    }
  }

  #handleQuantityInput(event) {
    const { productDetail } = this.state;
    const product = productDetail.product;
    const maxStock = product?.stock || 999;
    const inputValue = parseInt(event.target.value) || 1;
    this.#quantity = Math.max(1, Math.min(maxStock, inputValue));

    if (event.target.value !== this.#quantity.toString()) {
      const quantityInput = document.getElementById("quantity-input");
      if (quantityInput) {
        quantityInput.value = this.#quantity;
      }
    }
  }

  #handleAddToCart() {
    const { productDetail } = this.state;
    const { product } = productDetail;

    if (!product) return;

    const quantityInput = document.getElementById("quantity-input");
    const currentQuantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

    store.dispatch(actions.addToCart(product.productId, currentQuantity));
    store.dispatch(actions.showToast("장바구니에 추가되었습니다"));
  }

  #handleBreadcrumbClick(event) {
    event.preventDefault();
    const category1 = event.target.dataset.category1;
    const category2 = event.target.dataset.category2;

    let queryParams = [];
    if (category1) queryParams.push(`category1=${encodeURIComponent(category1)}`);
    if (category2) queryParams.push(`category2=${encodeURIComponent(category2)}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    window.history.pushState(null, "", `/${queryString}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  #handleGoToProductList() {
    window.history.pushState(null, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  #handleCartIconClick() {
    store.dispatch(actions.showCartModal());
  }

  #handleRelatedProductClick(card) {
    const productId = card.dataset.productId;
    if (productId) {
      window.history.pushState(null, "", `/product/${productId}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }

  cleanup() {
    this.#eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.#eventListeners = [];
  }
}
