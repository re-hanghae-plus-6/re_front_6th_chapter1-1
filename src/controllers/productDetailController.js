import { store } from "../store.js";
import { actions } from "../actions/index.js";
import { getProduct, getProducts } from "../api/productApi.js";

export class ProductDetailController {
  constructor(productId) {
    this.productId = productId;
    this.eventListeners = [];
    this.setupEventListeners();
  }

  get state() {
    return store.getState();
  }

  async initialize() {
    await this.loadProductDetail();
  }

  async loadProductDetail() {
    store.dispatch(actions.loadProductDetail());

    try {
      const product = await getProduct(this.productId);
      store.dispatch(actions.productDetailLoaded(product));

      await this.loadRelatedProducts(product);
    } catch (error) {
      console.error("상품 상세 정보 로딩 실패:", error);
      store.dispatch(actions.loadProductDetailError(error.message));
    }
  }

  async loadRelatedProducts(product) {
    if (!product || !product.category1) return;

    store.dispatch(actions.loadRelatedProducts());

    try {
      const relatedData = await getProducts({
        category1: product.category1,
        category2: product.category2,
      });

      const relatedProducts = relatedData.products.filter(
        (product) => product.productId !== this.productId && product.productId !== this.productId,
      );

      store.dispatch(actions.relatedProductsLoaded(relatedProducts));
    } catch (error) {
      console.error("관련 상품 로딩 실패:", error);
    }
  }

  setupEventListeners() {
    const clickHandler = (event) => {
      if (event.target.id === "quantity-decrease") {
        this.handleQuantityDecrease();
      }

      if (event.target.id === "quantity-increase") {
        this.handleQuantityIncrease();
      }

      if (event.target.id === "add-to-cart-btn") {
        this.handleAddToCart();
      }

      if (event.target.classList.contains("breadcrumb-link")) {
        this.handleBreadcrumbClick(event);
      }

      if (event.target.classList.contains("go-to-product-list")) {
        this.handleGoToProductList();
      }

      const relatedProductCard = event.target.closest(".related-product-card");
      if (relatedProductCard) {
        this.handleRelatedProductClick(relatedProductCard);
      }
    };

    const changeHandler = (event) => {
      if (event.target.id === "quantity-input") {
        this.handleQuantityInput(event);
      }
    };

    document.addEventListener("click", clickHandler);
    document.addEventListener("change", changeHandler);

    this.eventListeners.push(
      { element: document, type: "click", handler: clickHandler },
      { element: document, type: "change", handler: changeHandler },
    );
  }

  handleQuantityDecrease() {
    const { productDetail } = this.state;
    const newQuantity = Math.max(1, productDetail.quantity - 1);
    store.dispatch(actions.updateQuantity(newQuantity));

    const quantityInput = document.getElementById("quantity-input");
    if (quantityInput) {
      quantityInput.value = newQuantity;
    }
  }

  handleQuantityIncrease() {
    const { productDetail } = this.state;
    const product = productDetail.product;
    const maxStock = product?.stock;
    const newQuantity = Math.min(maxStock, productDetail.quantity + 1);
    store.dispatch(actions.updateQuantity(newQuantity));

    const quantityInput = document.getElementById("quantity-input");
    if (quantityInput) {
      quantityInput.value = newQuantity;
    }
  }

  handleQuantityInput(event) {
    const { productDetail } = this.state;
    const product = productDetail.product;
    const maxStock = product?.stock || 107;
    const newQuantity = Math.max(1, Math.min(maxStock, parseInt(event.target.value) || 1));

    store.dispatch(actions.updateQuantity(newQuantity));
    event.target.value = newQuantity;
  }

  handleAddToCart() {
    const { productDetail } = this.state;
    const { product, quantity } = productDetail;

    if (!product) return;

    store.dispatch(actions.addToCart(product, quantity));
  }

  handleBreadcrumbClick(event) {
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

  handleGoToProductList() {
    window.history.pushState(null, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  handleRelatedProductClick(card) {
    const productId = card.dataset.productId;
    if (productId) {
      window.history.pushState(null, "", `/product/${productId}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }

  cleanup() {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];
  }
}
