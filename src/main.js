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
  categories: {},
  total: 0,
  loading: false,
  hasNext: false,
  cart: [],
  page: 1,
  filters: {
    limit: 20,
    sort: "price_asc",
    search: "",
    category1: "",
    category2: "",
  },
};

let infiniteScroll = null;

const getFiltersFromUrl = () => {
  const params = new URLSearchParams(window.location.search);

  return {
    limit: params.get("limit") || 20,
    sort: params.get("sort") || "price_asc",
    search: params.get("search") || "",
    category1: params.get("category1") || "",
    category2: params.get("category2") || "",
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
    infiniteScroll.sethasNext(appState.hasNext);
  }
};

const getFullState = () => appState;

function render() {
  const state = getFullState();
  const html = HomPage(state);
  document.body.querySelector("#root").innerHTML = html;
}

async function loadInitialData() {
  if (appState.loading) return;
  setAppState({ loading: true });

  try {
    const currentParams = getFiltersFromUrl();
    const productParams = {
      page: 1,
      limit: parseInt(currentParams.limit, 10),
      sort: currentParams.sort,
      search: currentParams.search,
      category1: currentParams.category1,
      category2: currentParams.category2,
    };

    const [categoriesData, productsData] = await Promise.all([getCategories(), getProducts(productParams)]);
    setAppState({
      categories: categoriesData,
      products: productsData.products,
      total: productsData.pagination.total,
      hasNext: productsData.pagination.hasNext,
      page: productsData.pagination.hasNext ? 2 : 1,
      loading: false,
      filters: currentParams,
    });
  } catch (error) {
    console.error("초기 데이터 로딩 실패:", error);
    setAppState({ loading: false });
  }
}

async function loadProductsOnly(filters) {
  try {
    const productParams = {
      page: 1,
      limit: parseInt(filters.limit, 10),
      sort: filters.sort,
      search: filters.search,
      category1: filters.category1,
      category2: filters.category2,
    };

    const productsData = await getProducts(productParams);

    setAppState({
      products: productsData.products,
      total: productsData.pagination.total,
      hasNext: productsData.pagination.hasNext,
      page: productsData.pagination.hasNext ? 2 : 1,
      loading: false,
      filters: filters,
    });
  } catch (error) {
    console.error("상품 로딩 실패:", error);
    setAppState({ loading: false });
  }
}

async function loadNextPage() {
  if (appState.loading || !appState.hasNext) return false;
  setAppState({ loading: true });

  try {
    const params = {
      page: appState.page,
      limit: parseInt(appState.filters.limit, 10),
      sort: appState.filters.sort,
      search: appState.filters.search,
      category1: appState.filters.category1,
      category2: appState.filters.category2,
    };
    updateUrl(params);
    const data = await getProducts(params);

    setAppState({
      products: [...appState.products, ...data.products],
      total: data.pagination.total,
      hasNext: data.pagination.hasNext,
      page: appState.page + 1,
      loading: false,
    });

    return data.pagination.hasNext;
  } catch (error) {
    console.error("다음 페이지 로딩 실패:", error);
    setAppState({ loading: false });
    return false;
  }
}

function initInfiniteScroll() {
  if (infiniteScroll) {
    infiniteScroll.destroy();
  }

  infiniteScroll = new InfiniteScroll(loadNextPage, {
    threshold: 200,
    delay: 100,
    hasNext: appState.hasNext,
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
    page: 1,
  });

  try {
    await loadProductsOnly(updatedFilters);
    initInfiniteScroll();
  } catch (error) {
    console.error("필터 적용 실패:", error);
  }
};

function initEventListeners() {
  const root = document.querySelector("#root");

  window.addEventListener("popstate", async () => {
    const urlFilters = getFiltersFromUrl();

    setAppState({
      filters: urlFilters,
      products: [],
      hasNext: false,
      page: 1,
    });

    try {
      await loadInitialData();
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
    if (event.target.classList.contains("add-to-cart-btn") && event.target.dataset.productId) {
      const productId = event.target.dataset.productId;
      const selectedProducts = appState.products.find((product) => product.productId === productId);
      if (selectedProducts) {
        setAppState({ cart: [...appState.cart, selectedProducts] });
        toast.open("CREATE");
      }
      return;
    }

    if (event.target.dataset.category1) {
      const category1 = event.target.dataset.category1;
      await applyFilter({ category1, category2: "" });
    }

    if (event.target.dataset.category2) {
      const category2 = event.target.dataset.category2;
      await applyFilter({ category2 });
    }

    if (event.target.dataset.breadcrumb === "reset") {
      await applyFilter({ category1: "", category2: "" });
    }

    if (event.target.dataset.breadcrumb === "reset-category1") {
      await applyFilter({ category2: "" });
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
  const initialFilters = getFiltersFromUrl();
  setAppState({ filters: initialFilters });

  initEventListeners();

  try {
    await loadInitialData();
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
