import { getCategories, getProduct, getProducts } from "./api/productApi.js";
import { InfiniteScroll } from "./utils.js";
import HomPage from "./pages/HomePage/index";
import { toast } from "./pages/HomePage/components/Toast.js";
import { CartModal } from "./components/CartModal/index.js";
import { Router } from "./core/router";
import renderProductDetail from "./pages/DetailPage/index.js";
import NotFoundPage from "./pages/NotFound/index.js";

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
  cartModalOpen: false,
  page: 1,
  filters: {
    limit: 20,
    sort: "price_asc",
    search: "",
    category1: "",
    category2: "",
  },

  currentProduct: null,
  productLoading: false,
  relatedProducts: [],

  currentPage: "home",
};

let infiniteScroll = null;
let router = null;

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
  const prevState = { ...appState };

  appState = { ...prevState, ...newState };

  if (prevState.cartModalOpen !== appState.cartModalOpen) {
    if (appState.cartModalOpen) {
      cartModal.open();
    } else {
      cartModal.close();
    }
  }

  if (appState.cartModalOpen) {
    cartModal.update();
  }
  render();

  if (infiniteScroll && newState.hasNext !== undefined) {
    infiniteScroll.sethasNext(appState.hasNext);
  }
};

const getFullState = () => appState;

const cartModal = new CartModal({
  getState: getFullState,
  setState: setAppState,
  selector: document.body,
});

function renderHomePage(state) {
  return HomPage(state);
}

function render() {
  const state = getFullState();
  let html = "";

  switch (state.currentPage) {
    case "home":
      html = renderHomePage(state);
      break;
    case "product-detail":
      html = renderProductDetail(state);
      break;
    case "404":
      html = NotFoundPage();
      break;
    default:
      html = renderHomePage(state);
  }

  const root = document.body.querySelector("#root");
  if (root) {
    root.innerHTML = html;
  }
}

async function loadProductDetail(productId) {
  setAppState({
    productLoading: true,
    currentProduct: null,
    relatedProducts: [],
  });

  try {
    const product = await getProduct(productId);

    setAppState({
      currentProduct: product,
      productLoading: false,
    });

    const relatedProductsData = await getProducts({
      category1: product.category1,
      category2: product.category2,
      limit: 20,
    });

    const relatedProducts = relatedProductsData.products.filter((p) => p.productId !== productId);

    setAppState({
      relatedProducts,
    });
  } catch (error) {
    console.error("상품 상세 로딩 실패:", error);
    setAppState({ productLoading: false });
  }
}

async function loadInitialData() {
  if (!appState.loading) {
    setAppState({ loading: true });
  }

  try {
    const currentParams = appState.filters || getFiltersFromUrl();
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

function initRouter() {
  router = new Router();

  router.addRoute("/", async () => {
    const urlFilters = getFiltersFromUrl();

    setAppState({
      currentPage: "home",
      currentProduct: null,
      productLoading: false,
      relatedProducts: [],
      filters: urlFilters,
      loading: true,
    });

    await loadInitialData();
    initInfiniteScroll();
    initEventListeners();
  });

  router.addRoute("/products/:id", async (productId) => {
    setAppState({ currentPage: "product-detail" });
    await loadProductDetail(productId);
    initEventListeners();
  });

  router.addRoute("*", () => {
    setAppState({ currentPage: "404" });
  });
}

function initEventListeners() {
  const root = document.body.querySelector("#root");
  if (!root) return;

  root.removeEventListener("change", handleRootChange);
  root.removeEventListener("click", handleRootClick);
  root.removeEventListener("keydown", handleRootKeydown);

  root.addEventListener("change", handleRootChange);
  root.addEventListener("click", handleRootClick);
  root.addEventListener("keydown", handleRootKeydown);
}

async function handleRootChange(event) {
  const { target } = event;

  if (target.id === "limit-select") {
    await applyFilter({ limit: parseInt(target.value, 10) });
  }

  if (target.id === "sort-select") {
    await applyFilter({ sort: target.value });
  }
}

async function handleRootClick(event) {
  const { target } = event;

  if (target.id === "cart-icon-btn") {
    setAppState({ cartModalOpen: true });
    return;
  }

  if (target.classList.contains("add-to-cart-btn") || target.id === "add-to-cart-btn") {
    const productId = target.dataset.productId;
    let selectedProduct = null;

    if (appState.currentPage === "home") {
      selectedProduct = appState.products.find((product) => product.productId === productId);
    }

    if (!selectedProduct && appState.currentProduct) {
      selectedProduct = appState.currentProduct;
    }

    if (selectedProduct) {
      let quantity = 1;
      const quantityInput = document.querySelector("#quantity-input");
      if (quantityInput) {
        quantity = parseInt(quantityInput.value, 10) || 1;
      }
      const existingItem = appState.cart.find((item) => item.productId === productId);

      if (existingItem) {
        const updatedCart = appState.cart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        );
        setAppState({ cart: updatedCart });
      } else {
        setAppState({
          cart: [...appState.cart, { ...selectedProduct, quantity, selected: false }],
        });
      }

      toast.open("CREATE");
    }
    return;
  }

  if (target.classList.contains("breadcrumb-link")) {
    const category1 = target.dataset.category1;
    const category2 = target.dataset.category2;

    if (category1) {
      await applyFilter({ category1, category2: "", search: "" });
      router.navigate(`/?category1=${category1}`);
    }
    if (category2) {
      await applyFilter({ category1: appState.currentProduct.category1, category2, search: "" });
      router.navigate(`/?category1=${appState.currentProduct.category1}&category2=${category2}`);
    }

    return;
  }

  if (
    target.classList.contains("product-image") ||
    target.classList.contains("product-info") ||
    target.closest(".product-image") ||
    target.closest(".product-info")
  ) {
    event.preventDefault();
    const productCard = target.closest(".product-card");
    const productId = productCard?.dataset.productId || target.dataset.productId;
    if (productId) {
      router.navigate(`/products/${productId}`);
    }
    return;
  }

  if (target.closest(".related-product-card")) {
    const relatedCard = target.closest(".related-product-card");
    const productId = relatedCard.dataset.productId;
    if (productId) {
      router.navigate(`/products/${productId}`);
    }
    return;
  }

  if (target.closest("#quantity-increase")) {
    event.preventDefault();
    const quantityInput = document.querySelector("#quantity-input");
    if (quantityInput) {
      const currentValue = parseInt(quantityInput.value, 10) || 1;
      const maxValue = parseInt(quantityInput.getAttribute("max"), 10) || 999;
      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
        quantityInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    return;
  }

  if (target.closest("#quantity-decrease")) {
    event.preventDefault();
    const quantityInput = document.querySelector("#quantity-input");
    if (quantityInput) {
      const currentValue = parseInt(quantityInput.value, 10) || 1;
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
        quantityInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    return;
  }

  if (event.target.dataset.category1) {
    const category1 = event.target.dataset.category1;
    await applyFilter({ category1, category2: "" });
    router.navigate(`/?category1=${category1}`);
  }

  if (event.target.dataset.category2) {
    const category2 = event.target.dataset.category2;
    await applyFilter({ category2 });
    router.navigate(`/?category2=${category2}`);
  }

  if (event.target.dataset.breadcrumb === "reset") {
    await applyFilter({ category1: "", category2: "" });
    router.navigate("/");
  }

  if (event.target.dataset.breadcrumb === "category1") {
    await applyFilter({ category2: "" });
    router.navigate("/");
  }

  if (target.closest(".go-to-product-list")) {
    router.navigate("/");
    return;
  }
}

async function handleRootKeydown(event) {
  if (event.target.id === "search-input" && event.key === "Enter") {
    event.preventDefault();
    const search = event.target.value.trim();
    await applyFilter({ search });
  }
}

async function main() {
  const initialFilters = getFiltersFromUrl();

  setAppState({
    filters: initialFilters,
    currentPage: "home",
  });

  initRouter();

  await router.handleRoute();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
