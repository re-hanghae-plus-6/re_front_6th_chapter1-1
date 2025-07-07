import { getProducts } from "../api/productApi";
import { productListLoaded } from "../components/productListLoaded";
import { productListLoading } from "../components/productListLoading";

const root = document.getElementById("root");

let state = {
  page: 1,
  limit: 20,
  sort: "price_asc",
  isLoading: false,
  hasMore: true,
  products: [],
};

const renderLoading = () => {
  root.innerHTML = productListLoading;
};

const renderInitialContent = async () => {
  renderLoading();

  try {
    const { products } = await getProducts({ page: state.page, limit: state.limit, sort: state.sort });

    state.products = products;
    state.page = 1;
    state.hasMore = products.length === state.limit;

    root.innerHTML = productListLoaded(state.products, state.limit);

    setupProductLimitControl();
    setupSortControl();
    window.addEventListener("scroll", () => {
      setupInfiniteScroll();
    });
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
    const { products: nextProducts } = await getProducts({ page: state.page, limit: state.limit, sort: state.sort });

    if (!nextProducts || nextProducts.length === 0) {
      state.hasMore = false;
      return;
    }

    state.products = [...state.products, ...nextProducts];
    root.innerHTML = productListLoaded(state.products, state.limit);
    setupProductLimitControl();
    setupSortControl();
    setupInfiniteScroll();
  } catch (err) {
    console.error("다음 상품 로딩 실패:", err);
  } finally {
    state.isLoading = false;
  }
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
