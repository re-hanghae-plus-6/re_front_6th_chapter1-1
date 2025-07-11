import { productStore } from "../store/productStore.js";
import { cartStore } from "../store/cartStore.js";
import { updateQueryParams } from "./urlParam.js";
import { router } from "../router.js";

// 공통 필터 업데이트 함수
function updateFilter(params, loadProducts) {
  Object.entries(params).forEach(([key, value]) => {
    if (key === "limit") {
      productStore.setLimit(parseInt(value));
    } else if (key === "sort") {
      productStore.setSort(value);
    } else if (key === "search") {
      productStore.setSearch(value);
    } else if (key === "category1") {
      productStore.setCategory1(value);
    } else if (key === "category2") {
      productStore.setCategory2(value);
    }
  });

  updateQueryParams(params);
  productStore.setPage(1);
  productStore.setHasMore(true);
  loadProducts({ append: false });
}

// 필터 변경 이벤트 핸들러
function handleFilterChange(e, loadProducts) {
  const handlers = {
    "limit-select": () => updateFilter({ limit: parseInt(e.target.value) }, loadProducts),
    "sort-select": () => updateFilter({ sort: e.target.value }, loadProducts),
  };

  const handler = handlers[e.target.id];
  if (handler) handler();
}

// 검색 이벤트 핸들러
function handleSearchKeydown(e, loadProducts) {
  if (e.target.id === "search-input" && e.key === "Enter") {
    const searchTerm = e.target.value.trim();
    updateFilter({ search: searchTerm }, loadProducts);
  }
}

// 클릭 이벤트 핸들러
function handleClick(e, loadProducts) {
  const target = e.target;

  if (target.classList.contains("category1-filter-btn")) {
    updateFilter(
      {
        category1: target.dataset.category1,
        category2: "",
      },
      loadProducts,
    );
  }

  if (target.classList.contains("category2-filter-btn")) {
    const state = productStore.getState();
    updateFilter(
      {
        category1: state.category1,
        category2: target.dataset.category2,
      },
      loadProducts,
    );
  }

  const breadcrumbHandlers = {
    reset: () => updateFilter({ category1: "", category2: "" }, loadProducts),
    category1: () =>
      updateFilter(
        {
          category1: target.dataset.category1,
          category2: "",
        },
        loadProducts,
      ),
    category2: () => {
      const state = productStore.getState();
      updateFilter(
        {
          category1: state.category1,
          category2: target.dataset.category2,
        },
        loadProducts,
      );
    },
  };

  const breadcrumbHandler = breadcrumbHandlers[target.dataset.breadcrumb];
  if (breadcrumbHandler) {
    breadcrumbHandler();
    return;
  }

  // 상품 클릭
  if (target.closest(".product-card") && !target.closest(".add-to-cart-btn")) {
    const productId = target.closest("[data-product-id]")?.dataset.productId;
    if (productId) {
      window.history.pushState({}, "", `/product/${productId}`);
      router();
    }
  }

  // 장바구니 담기 버튼 클릭
  if (target.classList.contains("add-to-cart-btn")) {
    e.preventDefault();
    e.stopPropagation();

    cartStore.addToCart({}, 1);

    return;
  }
}

// 이벤트 리스너 등록 함수
export function registerHomeEventListeners(loadProducts) {
  if (window._homeEventRegistered) return;

  document.addEventListener("change", (e) => handleFilterChange(e, loadProducts));
  document.addEventListener("keydown", (e) => handleSearchKeydown(e, loadProducts));
  document.addEventListener("click", (e) => handleClick(e, loadProducts));

  window._homeEventRegistered = true;
}

// 이벤트 리스너 제거 함수
export function removeHomeEventListeners() {
  window._homeEventRegistered = false;
}
