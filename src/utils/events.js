import { getProducts } from "../api/productApi";
import { updateCurrent } from "../core/renderer";

import { cartState } from "../features/cart/Cart";
import { router } from "../core/router";
import { getMainState, setMainState } from "../pages/MainPage/MainPage";
import {
  addToCart,
  clearCart,
  getCartItems,
  removeCartItem,
  removeSelectedCartItems,
  toggleSelectAll,
  updateCartItemSelection,
  updateCartQuantity,
} from "./carts";
import { getSearchParams, setSearchParams } from "./store";

import { getDetailState, setDetailState } from "../pages/ProductDetailPage/ProductDetailPage";
import { setToastState } from "../components/layout/Toast";

// 표시 개수 변경 이벤트 핸들러
const handleLimitChange = async (value) => {
  const mainState = getMainState();
  const searchParams = getSearchParams();

  // mainState 업데이트
  setMainState({
    ...mainState,
    limit: value,
    page: 1,
  });

  // URL 업데이트
  searchParams.set("limit", value);
  searchParams.set("page", "1");
  setSearchParams(searchParams);
  router.navigate(`?${searchParams.toString()}`);

  const paramsObject = Object.fromEntries(searchParams);
  const data = await getProducts(paramsObject);

  setMainState({
    ...mainState,
    products: data.products,
    page: data.pagination.page,
    hasNext: data.pagination.hasNext,
    limit: value,
  });
};

// 정렬 변경 이벤트 핸들러
const handleSortChange = async (value) => {
  const mainState = getMainState();
  const searchParams = getSearchParams();

  // mainState 업데이트
  setMainState({
    ...mainState,
    sort: value,
    page: 1,
  });

  // URL 업데이트
  searchParams.set("sort", value);
  searchParams.set("page", "1");
  setSearchParams(searchParams);
  router.navigate(`?${searchParams.toString()}`);

  const paramsObject = Object.fromEntries(searchParams);
  const data = await getProducts(paramsObject);

  setMainState({
    ...mainState,
    products: data.products,
    page: data.pagination.page,
    hasNext: data.pagination.hasNext,
    sort: value,
  });
};

// 검색 이벤트 핸들러
const handleSearchChange = async (value) => {
  const mainState = getMainState();
  const searchParams = getSearchParams();

  // mainState 업데이트
  setMainState({
    ...mainState,
    search: value,
    page: 1,
  });

  // URL 업데이트
  searchParams.set("search", value);
  searchParams.set("page", "1");
  setSearchParams(searchParams);
  router.navigate(`?${searchParams.toString()}`);

  const paramsObject = Object.fromEntries(searchParams);
  const data = await getProducts(paramsObject);

  setMainState({
    ...mainState,
    products: data.products,
    page: data.pagination.page,
    hasNext: data.pagination.hasNext,
    total: data.pagination.total,
    search: value,
  });
};

// 카테고리 이벤트 핸들러
const handleCategoryChange = async (value, depth) => {
  const mainState = getMainState();
  const searchParams = getSearchParams();

  if (depth === 1) {
    setMainState({
      ...mainState,
      category1: value,
      category2: "",
      page: 1,
    });
    searchParams.set("category1", value);
    searchParams.delete("category2");
  } else if (depth === 2) {
    setMainState({
      ...mainState,
      category2: value,
      page: 1,
    });
    searchParams.set("category2", value);
  } else {
    setMainState({
      ...mainState,
      category1: "",
      category2: "",
      page: 1,
    });
    searchParams.delete("category1");
    searchParams.delete("category2");
  }

  searchParams.set("page", "1");
  setSearchParams(searchParams);
  router.navigate(`?${searchParams.toString()}`);

  const paramsObject = Object.fromEntries(searchParams);
  const data = await getProducts(paramsObject);

  setMainState({
    ...mainState,
    products: data.products,
    page: data.pagination.page,
    hasNext: data.pagination.hasNext,
    total: data.pagination.total,
    category1: data.filters.category1,
    category2: data.filters.category2,
  });
};

// 브레드크럼 카테고리 설정 함수
const handleBreadcrumbCategory = async (category1, category2, path = "/") => {
  const mainState = getMainState();
  const searchParams = getSearchParams();

  setMainState({
    ...mainState,
    category1: category1 || "",
    category2: category2 || "",
    page: 1,
  });

  if (category1) {
    searchParams.set("category1", category1);
  } else {
    searchParams.delete("category1");
  }

  if (category2) {
    searchParams.set("category2", category2);
  } else {
    searchParams.delete("category2");
  }

  searchParams.set("page", "1");
  setSearchParams(searchParams);
  router.navigate(`${path}?${searchParams.toString()}`);

  const paramsObject = Object.fromEntries(searchParams);
  const data = await getProducts(paramsObject);

  setMainState({
    ...mainState,
    products: data.products,
    page: data.pagination.page,
    hasNext: data.pagination.hasNext,
    total: data.pagination.total,
    category1: data.filters.category1,
    category2: data.filters.category2,
  });
};

// 브레드크럼 클릭 이벤트 핸들러
const handleBreadcrumbClick = async (type) => {
  const mainState = getMainState();
  const searchParams = getSearchParams();

  if (type === "reset") {
    setMainState({
      ...mainState,
      category1: "",
      category2: "",
      page: 1,
    });
    searchParams.delete("category1");
    searchParams.delete("category2");
  } else if (type === "category1") {
    setMainState({
      ...mainState,
      category2: "",
      page: 1,
    });
    searchParams.delete("category2");
  }

  searchParams.set("page", "1");
  setSearchParams(searchParams);
  router.navigate(`?${searchParams.toString()}`);

  const paramsObject = Object.fromEntries(searchParams);
  const data = await getProducts(paramsObject);

  setMainState({
    ...mainState,
    products: data.products,
    page: data.pagination.page,
    hasNext: data.pagination.hasNext,
    total: data.pagination.total,
    category1: data.filters.category1,
    category2: data.filters.category2,
    // categories는 유지
  });
};

// 무한 스크롤 이벤트 핸들러
const handleInfiniteScroll = async () => {
  const mainState = getMainState();
  const searchParams = getSearchParams();

  // 이미 로딩 중이거나 다음 페이지가 없으면 리턴
  if (mainState.isInfiniteLoading || !mainState.hasNext) return;

  // 로딩 상태 시작
  setMainState({
    ...mainState,
    isInfiniteLoading: true,
  });
  updateCurrent();

  const nextPage = mainState.page + 1;

  // URL 업데이트 (무한스크롤은 replaceState 사용)
  searchParams.set("page", nextPage.toString());
  setSearchParams(searchParams);
  router.navigate(`?${searchParams.toString()}`, { replace: true });

  const paramsObject = Object.fromEntries(searchParams);
  const data = await getProducts(paramsObject);

  // 기존 상품들에 새로운 상품들을 추가하고 로딩 상태 종료
  setMainState({
    ...mainState,
    products: [...mainState.products, ...data.products],
    page: data.pagination.page,
    hasNext: data.pagination.hasNext,
    isInfiniteLoading: false,
  });
  updateCurrent();
};

// resetFormValues는 콜백 시스템으로 대체되어 제거됨

let isListenerSet = false;
let isScrolling = false;

// 이벤트 핸들러 함수들을 모듈 레벨에서 정의
const handleChange = async (e) => {
  if (e.target.id === "limit-select") {
    const value = e.target.value;
    await handleLimitChange(value);
  }

  if (e.target.id === "sort-select") {
    const value = e.target.value;
    await handleSortChange(value);
  }

  if (e.target.closest("#cart-modal-select-all-checkbox")) {
    const currentItems = getCartItems();
    const allCurrentlySelected = currentItems.every((item) => item.isSelected);
    const newSelectionState = !allCurrentlySelected;

    // localStorage 업데이트
    toggleSelectAll(newSelectionState);
  }

  if (e.target.classList.contains("cart-item-checkbox")) {
    const productId = e.target.dataset.productId;
    const isSelected = e.target.checked;

    // localStorage 업데이트
    updateCartItemSelection(productId, isSelected);
  }

  // 변경 후 업데이트
  updateCurrent();
};

const handleKeydown = async (e) => {
  if (e.target.id === "search-input" && e.key === "Enter") {
    const value = e.target.value;
    await handleSearchChange(value);
    // 검색 후 업데이트
    updateCurrent();
  }

  if (e.key === "Escape") {
    if (cartState.isOpen) {
      cartState.isOpen = false;
      updateCurrent();
    }
  }
};

const handleClick = async (e) => {
  let shouldUpdate = false;

  if (e.target.classList.contains("add-to-cart-btn")) {
    const productId = e.target.dataset.productId;

    const mainState = getMainState();
    const product = mainState.products.find((product) => product.productId === productId);

    if (product) {
      addToCart(product);
      setToastState({
        toastType: "success",
      });

      shouldUpdate = true;
    }
  }

  if (e.target.id === "add-to-cart-btn") {
    const detailState = getDetailState();
    const product = detailState.product;

    if (product) {
      addToCart(product, detailState.quantity);
      setDetailState((prev) => ({ ...prev, quantity: 1 }));
      setToastState({
        toastType: "success",
      });

      shouldUpdate = true;
    }
  }

  if (e.target.closest("#toast-close-btn")) {
    setToastState({
      toastType: null,
    });

    shouldUpdate = true;
  }

  // 카테고리 버튼 클릭 처리 - 클래스명으로 구분
  if (e.target.classList.contains("category1-filter-btn")) {
    await handleCategoryChange(e.target.dataset.category1, 1);
    shouldUpdate = true;
  } else if (e.target.classList.contains("category2-filter-btn")) {
    await handleCategoryChange(e.target.dataset.category2, 2);
    shouldUpdate = true;
  }

  if (e.target.dataset.breadcrumb) {
    await handleBreadcrumbClick(e.target.dataset.breadcrumb);
    shouldUpdate = true;
  }

  if (e.target.classList.contains("breadcrumb-link")) {
    const category1 = e.target.dataset.category1;
    const category2 = e.target.dataset.category2;

    await handleBreadcrumbCategory(category1, category2);
    shouldUpdate = true;
  }

  if (e.target.closest("#cart-icon-btn")) {
    cartState.isOpen = true;
    shouldUpdate = true;
  }

  if (e.target.closest("#cart-modal-close-btn")) {
    cartState.isOpen = false;
    shouldUpdate = true;
  }

  if (e.target.closest("#quantity-decrease")) {
    setDetailState((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
    shouldUpdate = true;
  }
  if (e.target.closest("#quantity-increase")) {
    setDetailState((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
    shouldUpdate = true;
  }

  if (e.target.closest(".quantity-decrease-btn")) {
    const productId = e.target.closest(".quantity-decrease-btn").dataset.productId;
    const newCartItems = updateCartQuantity(productId, "decrease");

    // 즉시 DOM 업데이트
    const quantityInput = document.querySelector(`[data-product-id="${productId}"].quantity-input`);
    if (quantityInput && newCartItems) {
      const updatedItem = newCartItems.find((item) => item.productId === productId);
      if (updatedItem) {
        quantityInput.value = updatedItem.quantity;
      }
    }

    shouldUpdate = true;
  }

  if (e.target.closest(".quantity-increase-btn")) {
    const productId = e.target.closest(".quantity-increase-btn").dataset.productId;
    const newCartItems = updateCartQuantity(productId, "increase");

    // 즉시 DOM 업데이트
    const quantityInput = document.querySelector(`[data-product-id="${productId}"].quantity-input`);
    if (quantityInput && newCartItems) {
      const updatedItem = newCartItems.find((item) => item.productId === productId);
      if (updatedItem) {
        quantityInput.value = updatedItem.quantity;
      }
    }

    shouldUpdate = true;
  }

  if (e.target.closest(".cart-modal-overlay") && !e.target.closest("[data-modal-content]")) {
    cartState.isOpen = false;
    shouldUpdate = true;
  }

  if (e.target.closest(".cart-item-remove-btn")) {
    const productId = e.target.closest(".cart-item-remove-btn").dataset.productId;

    removeCartItem(productId);
    shouldUpdate = true;
  }

  if (e.target.closest("#cart-modal-remove-selected-btn")) {
    removeSelectedCartItems();
    shouldUpdate = true;
  }

  if (e.target.closest("#cart-modal-clear-cart-btn")) {
    clearCart();

    shouldUpdate = true;
  }

  if (e.target.closest(".product-image") || e.target.closest(".product-info")) {
    const productId = e.target.closest(".product-card").dataset.productId;
    router.navigate(`/product/${productId}`);
    const route = router.findRoute(router.getCurrentPath());

    if (route.component.onMount) {
      route.component.onMount();
    }
    shouldUpdate = true;
  }

  if (e.target.closest(".related-product-card")) {
    const productId = e.target.closest(".related-product-card").dataset.productId;
    router.navigate(`/product/${productId}`);
    const route = router.findRoute(router.getCurrentPath());

    if (route.component.onMount) {
      route.component.onMount();
    }
    shouldUpdate = true;
  }

  // 클릭 이벤트 처리 후 업데이트
  if (shouldUpdate) {
    updateCurrent();
  }
};

const handleScroll = async (e) => {
  // 메인페이지에서만 무한 스크롤 처리
  const currentPath = window.location.pathname;
  if (currentPath !== "/") return;

  const mainState = getMainState();

  // 이미 스크롤 처리 중이거나 다음 페이지가 없으면 리턴
  if (isScrolling || !mainState.hasNext) return;

  // 테스트 환경에서 scrollingElement가 없을 수 있으므로 안전하게 처리
  const scrollingElement = e.target.scrollingElement || document.documentElement;
  if (!scrollingElement) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollingElement;
  if (scrollHeight - scrollTop <= clientHeight + 100) {
    isScrolling = true;
    await handleInfiniteScroll();
    isScrolling = false;
  }
};

// handlePopState는 router에서 처리하도록 제거

export const initEventListeners = () => {
  if (isListenerSet) return;

  // 기존 이벤트 리스너 제거
  document.removeEventListener("change", handleChange);
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("click", handleClick);
  document.removeEventListener("scroll", handleScroll);

  // 새 이벤트 리스너 등록 (popstate는 router에서 처리)
  document.addEventListener("change", handleChange);
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", handleClick);
  window.addEventListener("scroll", handleScroll);

  isListenerSet = true;
};
