import { getCategories, getProducts } from "./api/productApi.js";
import { InfiniteScroll } from "./utils.js";
import HomPage from "./pages/HomePage/index";
import { toast } from "./pages/HomePage/components/Toast.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let appState = {
  products: [],
  total: 0,
  loading: false,
  hasNext: false,
  categories: [],
  cart: [],
  currentPage: 1,
  filters: {
    limit: 20,
    sort: "price_asc",
    search: "",
  },
};

let infiniteScroll = null;

const getFiltersFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    limit: parseInt(params.get("limit")) || 20,
    sort: params.get("sort") || "price_asc",
    search: params.get("search") || "",
  };
};

const updateUrl = (newParams) => {
  const current = getFiltersFromUrl();
  const updated = { ...current, ...newParams };

  const searchParams = new URLSearchParams();
  Object.entries(updated).forEach(([key, value]) => {
    if (value && value !== "") {
      searchParams.set(key, value.toString());
    }
  });

  const newUrl = `${window.location.pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
  window.history.replaceState({}, "", newUrl);
};

const setAppState = (newState) => {
  appState = { ...appState, ...newState };
  render();

  if (infiniteScroll && newState.hasNext !== undefined) {
    infiniteScroll.setHasMore(appState.hasNext);
  }
};

const getFullState = () => appState;

function render() {
  const state = getFullState();
  const html = HomPage(state);
  document.body.querySelector("#root").innerHTML = html;
}

async function loadProducts(reset = false) {
  if (appState.loading) return false;
  setAppState({ loading: true });

  try {
    const currentParams = getFiltersFromUrl();

    const pageToLoad = reset ? 1 : appState.currentPage;

    const params = {
      page: pageToLoad,
      limit: currentParams.limit,
      sort: currentParams.sort,
      search: currentParams.search || "",
    };

    const data = await getProducts(params);

    setAppState({
      products: reset ? data.products : [...appState.products, ...data.products],
      total: data.pagination.total,
      hasNext: data.pagination.hasNext,
      currentPage: reset ? 2 : appState.currentPage + 1,
      loading: false,
    });

    return data.pagination.hasNext;
  } catch (error) {
    console.error("상품 로딩 실패:", error);
    setAppState({ loading: false });
    return false;
  }
}

function initInfiniteScroll() {
  if (infiniteScroll) {
    infiniteScroll.destroy();
  }

  infiniteScroll = new InfiniteScroll(loadProducts, {
    threshold: 200,
    delay: 100,
  });
  infiniteScroll.init();
}

const applyFilter = async (newFilterValues) => {
  const updatedFilters = {
    ...appState.filters,
    ...newFilterValues,
  };

  updateUrl(updatedFilters);

  setAppState({
    filters: updatedFilters,
    products: [],
    hasNext: false,
    currentPage: 1,
  });

  try {
    await loadProducts(true);
    initInfiniteScroll();
  } catch (error) {
    console.error("필터 적용 실패:", error);
  }
};

function initEventListeners() {
  const root = document.querySelector("#root");
  const urlFilters = getFiltersFromUrl();

  window.addEventListener("popstate", async () => {
    setAppState({
      filters: urlFilters,
      products: [],
      hasNext: false,
      currentPage: 1,
    });

    try {
      await loadProducts(true);
      initInfiniteScroll();
    } catch (error) {
      console.error("페이지 네비게이션 실패:", error);
    }
  });

  root.addEventListener("change", async (event) => {
    const { target } = event;

    if (target.id === "limit-select") {
      await applyFilter({ limit: parseInt(target.value, 10) });
    }

    if (target.id === "sort-select") {
      await applyFilter({ sort: target.value });
    }
  });

  root.addEventListener("click", async (event) => {
    if (event.target.id === "search-input" && event.target.value.trim().length > 0) {
      const search = event.target.value.trim();
      await applyFilter({ search });
    }

    if (event.target.dataset.productId) {
      const productId = event.target.dataset.productId;
      const selectedProducts = appState.products.find((product) => product.productId === productId);
      if (selectedProducts) {
        setAppState({ cart: [...appState.cart, selectedProducts] });
        toast.open("CREATE");
      }
    }
  });

  root.addEventListener("keydown", async (event) => {
    if (event.target.id === "search-input" && event.key === "Enter") {
      event.preventDefault();
      const search = event.target.value.trim();
      await applyFilter({ search });
    }
  });
}

async function main() {
  setAppState({ loading: true });

  const initialFilters = getFiltersFromUrl();

  try {
    const categories = await getCategories();
    setAppState({ categories, loading: false, filters: initialFilters });
  } catch (error) {
    console.error("카테고리 로딩 실패:", error);
    setAppState({ loading: false });
  }

  initEventListeners();

  try {
    await loadProducts(true);
    initInfiniteScroll();
  } catch (error) {
    console.error("초기 상품 로딩 실패:", error);
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
