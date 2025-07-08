import { getProducts, getCategories } from "../api/productApi";
import { productListLoaded } from "../components/productListLoaded";
import { productListLoading } from "../components/productListLoading";
import { setupSearchEventListeners } from "../utils/searchHandler";

const root = document.getElementById("root");

let state = {
  page: 1,
  limit: 20,
  sort: "price_asc",
  search: "",
  category1: "",
  category2: "",
  isLoading: false,
  hasMore: true,
  products: [],
  categories: {},
  selectedCategories: {},
};

const renderLoading = () => {
  root.innerHTML = productListLoading;
};

const renderContent = () => {
  root.innerHTML = productListLoaded(
    state.products,
    state.limit,
    state.search,
    state.categories,
    state.selectedCategories,
  );
  setupProductLimitControl();
  setupSortControl();
  setupCategoryEventListeners();
  setupSearchEventListeners(state, renderContent);
  window.addEventListener("scroll", () => {
    setupInfiniteScroll();
  });
};

const loadCategories = async () => {
  try {
    const categories = await getCategories();
    state.categories = categories;
  } catch (err) {
    console.error("카테고리 로딩 실패:", err);
    state.categories = {};
  }
};

const renderInitialContent = async () => {
  renderLoading();

  try {
    // 카테고리 데이터 로드
    await loadCategories();

    const { products } = await getProducts({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      search: state.search,
      category1: state.category1,
      category2: state.category2,
    });

    state.products = products;
    state.page = 1;
    state.hasMore = products.length === state.limit;

    renderContent();
  } catch (err) {
    console.error("초기 상품 목록 로딩 실패:", err);
    root.innerHTML = `<div class="p-4 text-red-600">상품을 불러오지 못했습니다.</div>`;
  }
};

const loadMoreProducts = async () => {
  if (state.isLoading || !state.hasMore) return;
  state.isLoading = true;
  state.page += 1;

  renderLoading();
  try {
    const { products: nextProducts } = await getProducts({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      search: state.search,
      category1: state.category1,
      category2: state.category2,
    });

    if (!nextProducts || nextProducts.length === 0) {
      state.hasMore = false;
      return;
    }

    state.products = [...state.products, ...nextProducts];
    renderContent();
  } catch (err) {
    console.error("다음 상품 로딩 실패:", err);
  } finally {
    state.isLoading = false;
  }
};

const setupCategoryEventListeners = () => {
  // 1depth 카테고리 버튼 이벤트
  const category1Buttons = document.querySelectorAll(".category1-filter-btn");
  category1Buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const category1 = e.target.dataset.category1;

      // 이미 선택된 카테고리라면 선택 해제
      if (state.selectedCategories.category1 === category1) {
        state.selectedCategories = {};
        state.category1 = "";
        state.category2 = "";
      } else {
        // 새로운 카테고리 선택
        state.selectedCategories = { category1 };
        state.category1 = category1;
        state.category2 = "";
      }

      await renderInitialContent();
    });
  });

  // 2depth 카테고리 버튼 이벤트
  const category2Buttons = document.querySelectorAll(".category2-filter-btn");
  category2Buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const category2 = e.target.dataset.category2;

      // 이미 선택된 카테고리라면 선택 해제 (1단계로 돌아감)
      if (state.selectedCategories.category2 === category2) {
        state.selectedCategories = { category1: state.selectedCategories.category1 };
        state.category2 = "";
      } else {
        // 새로운 카테고리 선택
        state.selectedCategories = {
          category1: state.selectedCategories.category1,
          category2,
        };
        state.category2 = category2;
      }

      await renderInitialContent();
    });
  });

  // 브레드크럼 이벤트
  const breadcrumbButtons = document.querySelectorAll("[data-breadcrumb]");
  breadcrumbButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const breadcrumbIndex = e.target.dataset.breadcrumb;

      if (breadcrumbIndex === "reset") {
        // 전체로 돌아가기
        state.selectedCategories = {};
        state.category1 = "";
        state.category2 = "";
      } else {
        // 해당 단계까지만 유지
        const index = parseInt(breadcrumbIndex);

        if (index === 1) {
          // 1단계까지만 유지 (2단계 선택 해제)
          state.selectedCategories = { category1: state.selectedCategories.category1 };
          state.category2 = "";
        }
      }

      await renderInitialContent();
    });
  });
};

const setupSortControl = () => {
  const sortSelect = document.querySelector("#sort-select");
  if (!sortSelect) return;

  sortSelect.value = state.sort;

  sortSelect.addEventListener("change", async (e) => {
    const newSort = e.target.value;
    if (newSort !== state.sort) {
      state.sort = newSort;
      await renderInitialContent();
    }
  });
};

const setupProductLimitControl = () => {
  const select = document.getElementById("limit-select");
  if (!select) return;

  select.value = String(state.limit);

  select.addEventListener("change", async (e) => {
    const newLimit = parseInt(e.target.value, 10);
    if (!isNaN(newLimit) && newLimit !== state.limit) {
      state.limit = newLimit;
      await renderInitialContent();
    }
  });
};

const setupInfiniteScroll = () => {
  if (typeof window === "undefined" || location.pathname !== "/" || import.meta.env.TEST) return;

  const sentinel = document.createElement("div");
  sentinel.id = "scroll-sentinel";
  sentinel.className = "h-4";
  document.body.appendChild(sentinel);

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMoreProducts();
    }
  });

  observer.observe(sentinel);
};

export const productListPage = async () => {
  await renderInitialContent();
};
