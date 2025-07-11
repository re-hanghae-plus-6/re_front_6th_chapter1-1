import { cartStore } from "../store/cartStore.js";
import { productStore } from "../store/productStore.js";
import { updateQueryParams } from "./urlParam.js";

export function registerDetailEventListeners({ productId, cartUpdate, navigate }) {
  // 브레드크럼
  const breadcrumbLinks = document.querySelectorAll(".breadcrumb-link");
  const homeBreadcrumb = document.getElementById("home-breadcrumb-link");
  const goToProductListBtn = document.getElementById("go-to-product-list");

  // 관련 상품 카드
  const relatedCards = document.querySelectorAll(".related-product-card");

  // 수량 조절
  const quantityInput = document.getElementById("quantity-input");
  const decreaseBtn = document.getElementById("quantity-decrease");
  const increaseBtn = document.getElementById("quantity-increase");
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const backButton = document.getElementById("back-button");

  function backButtonHandler() {
    navigate?.("/");
  }
  function goToProductListHandler(e) {
    e.preventDefault();
    navigate?.("/");
  }

  // 브레드크럼 클릭 이벤트 핸들러
  function homeBreadcrumbHandler(e) {
    e.preventDefault();
    navigate?.("/");
  }
  function breadcrumbLinkHandler(e) {
    e.preventDefault();
    const target = e.currentTarget;
    if (target.dataset.category1) {
      const category1 = target.dataset.category1;

      productStore.setCategory1(category1);
      productStore.setCategory2("");
      updateQueryParams({ category1, category2: "" });

      navigate?.(`/?category1=${category1}`);
    } else if (target.dataset.category2) {
      const category2 = target.dataset.category2;
      const state = productStore.getState();

      productStore.setCategory2(category2);
      updateQueryParams({ category1: state.category1, category2 });

      navigate?.(`/?category1=${state.category1}&category2=${category2}`);
    }
  }

  // 관련 상품 클릭 이벤트 핸들러
  function relatedCardHandler(e) {
    e.preventDefault();
    const productId = e.currentTarget.dataset.productId;
    if (productId) {
      navigate?.(`/product/${productId}`);
    }
  }

  // 장바구니 수량 조절 이벤트 핸들러
  function decreaseHandler() {
    const value = parseInt(quantityInput.value) || 1;
    if (value > 1) quantityInput.value = value - 1;
  }
  function increaseHandler() {
    const value = parseInt(quantityInput.value) || 1;
    const max = parseInt(quantityInput.max);
    if (value < max) quantityInput.value = value + 1;
  }
  function inputHandler() {
    let value = parseInt(quantityInput.value) || 1;
    const max = parseInt(quantityInput.max);
    if (value < 1) quantityInput.value = 1;
    if (value > max) quantityInput.value = max;
  }
  function addToCartHandler() {
    if (productId) {
      cartStore.addToCart(productId, 1);
      cartUpdate?.();
    }
  }

  // 이벤트 리스너 등록
  decreaseBtn?.addEventListener("click", decreaseHandler);
  increaseBtn?.addEventListener("click", increaseHandler);
  quantityInput?.addEventListener("input", inputHandler);
  addToCartBtn?.addEventListener("click", addToCartHandler);
  backButton?.addEventListener("click", backButtonHandler);
  homeBreadcrumb?.addEventListener("click", homeBreadcrumbHandler);
  goToProductListBtn?.addEventListener("click", goToProductListHandler);
  breadcrumbLinks.forEach((link) => link.addEventListener("click", breadcrumbLinkHandler));
  relatedCards.forEach((card) => card.addEventListener("click", relatedCardHandler));

  // 클린업 함수 반환
  return function cleanup() {
    decreaseBtn?.removeEventListener("click", decreaseHandler);
    increaseBtn?.removeEventListener("click", increaseHandler);
    quantityInput?.removeEventListener("input", inputHandler);
    addToCartBtn?.removeEventListener("click", addToCartHandler);
    backButton?.removeEventListener("click", backButtonHandler);
    homeBreadcrumb?.removeEventListener("click", homeBreadcrumbHandler);
    goToProductListBtn?.removeEventListener("click", goToProductListHandler);
    breadcrumbLinks.forEach((link) => link.removeEventListener("click", breadcrumbLinkHandler));
    relatedCards.forEach((card) => card.removeEventListener("click", relatedCardHandler));
  };
}
