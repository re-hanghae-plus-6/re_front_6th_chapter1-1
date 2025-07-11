import { handleChangeLimitSelect, handleChangeCategory1Select } from "../handlers/filterHandlers.js";
import { handleCategoryFilterClick, handleBreadcrumbClick } from "../handlers/categoryHandlers.js";
import { handleSearchKeyDown } from "../handlers/searchHandlers.js";
import { handleAddToCart, handleProductDetailClick } from "../handlers/productItemHandlers.js";
import {
  handleCartQuantityChange,
  handleQuantityIncrease,
  handleQuantityDecrease,
  handleRemoveFromCart,
  handleOpenCartDialog,
} from "../handlers/cartHandlers.js";

export const addMainEventListeners = () => {
  // 개수 선택 이벤트
  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) limitSelect.addEventListener("change", handleChangeLimitSelect);

  // 정렬 선택 이벤트
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) sortSelect.addEventListener("change", handleChangeCategory1Select);

  // 검색 이벤트
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.addEventListener("keydown", handleSearchKeyDown);

  // 카테고리 필터링 버튼 이벤트 위임
  const categoryList = document.getElementById("category-list");
  if (categoryList) {
    categoryList.addEventListener("click", handleCategoryFilterClick);
  }

  // 브레드크럼 이벤트 위임 - 더 구체적인 선택자 사용
  const breadcrumbList = document.getElementById("breadcrumb-list");
  if (breadcrumbList) {
    breadcrumbList.addEventListener("click", handleBreadcrumbClick);
  }
};

export const removeMainEventListeners = () => {
  // 개수 선택 이벤트 제거
  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) limitSelect.removeEventListener("change", handleChangeLimitSelect);

  // 정렬 선택 이벤트 제거
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) sortSelect.removeEventListener("change", handleChangeCategory1Select);

  // 검색 이벤트 제거
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.removeEventListener("keydown", handleSearchKeyDown);

  // 카테고리 필터링 버튼 이벤트 제거
  const categoryList = document.getElementById("category-list");
  if (categoryList) categoryList.removeEventListener("click", handleCategoryFilterClick);

  // 브레드크럼 이벤트 제거 - 더 구체적인 선택자 사용
  const breadcrumbList = document.getElementById("breadcrumb-list");
  if (breadcrumbList) {
    breadcrumbList.removeEventListener("click", handleBreadcrumbClick);
  }
};

export const addProductItemEventListeners = () => {
  const productsGrid = document.getElementById("products-grid");
  if (!productsGrid) return;

  // 상품 상세 페이지 진입 클릭 이벤트
  productsGrid.addEventListener("click", handleProductDetailClick);
  productsGrid.addEventListener("click", handleAddToCart);
};

export const removeProductItemEventListeners = () => {
  const productsGrid = document.getElementById("products-grid");
  if (!productsGrid) return;

  // 상품 상세 페이지 진입 클릭 이벤트
  productsGrid.removeEventListener("click", handleProductDetailClick);
  productsGrid.removeEventListener("click", handleAddToCart);
};

const handleCartDialogEvents = (e) => {
  handleQuantityIncrease(e);
  handleQuantityDecrease(e);
  handleRemoveFromCart(e);
};

export const addCartDialogEventListeners = () => {
  // 장바구니 다이얼로그 이벤트들
  const cartDialog = document.getElementById("cart-dialog");
  if (cartDialog) {
    cartDialog.addEventListener("change", handleCartQuantityChange);
    cartDialog.addEventListener("click", handleCartDialogEvents);
  }
};

export const removeCartDialogEventListeners = () => {
  // cart-icon-btn 이벤트 제거
  const addToCartButtons = document.getElementById("cart-icon-btn");
  if (addToCartButtons) addToCartButtons.removeEventListener("click", handleOpenCartDialog);

  // 장바구니 다이얼로그 이벤트들 제거
  const cartDialog = document.getElementById("cart-dialog");
  if (cartDialog) {
    cartDialog.removeEventListener("change", handleCartQuantityChange);
    cartDialog.removeEventListener("click", handleCartDialogEvents);
  }
};
