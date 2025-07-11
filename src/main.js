import { HomePage } from "./pages/Homepage.js";
import { ProductPage } from "./pages/ProductPage.js";
import { EmptyPage } from "./pages/EmptyPage.js";
import { getProducts, getCategories } from "./api/productApi.js";
import { store, resetStoreState } from "./store.js";

import ProductItem from "./components/ProductItem.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let isThrottled = false;

export const resetGlobalState = resetStoreState;

const updateTotalProductCountUI = () => {
  const totalCountSpan = document.getElementById("total-product-count");
  if (totalCountSpan) {
    totalCountSpan.textContent = store.getState().total.toLocaleString();
  }
};

const updateProductListUI = (isAppend = false) => {
  const productsGrid = document.getElementById("products-grid");
  if (!productsGrid) return;

  const currentProducts = store.getState().products;

  if (!isAppend) {
    productsGrid.innerHTML = "";
  }

  productsGrid.innerHTML = currentProducts.map((product) => ProductItem(product)).join("");
};

const updateCurrentPageUI = () => {
  const currentPath = window.location.pathname;
  if (currentPath === "/") {
    updateTotalProductCountUI();
    updateProductListUI(false);
  }
};

const fetchAndRenderHomepageData = async (isInfiniteScroll = false) => {
  const currentState = store.getState();

  if (isInfiniteScroll) {
    if (!currentState.hasMore || currentState.isFetchingMore) {
      return;
    }
    store.dispatch({ type: "SET_FETCHING_MORE", payload: { isFetchingMore: true } });
    store.dispatch({ type: "INCREMENT_PAGE", payload: { currentPage: currentState.currentPage + 1 } });
  } else {
    store.dispatch({ type: "SET_LOADING", payload: { loading: true } });
    store.dispatch({ type: "RESET_PAGE", payload: { currentPage: 1 } });
    store.dispatch({ type: "RESET_PRODUCTS", payload: { products: [] } });
    store.dispatch({ type: "SET_HAS_MORE", payload: { hasMore: true } });
  }

  try {
    const { currentLimit, currentSort, currentSearch, currentPage, selectedCategory1, selectedCategory2 } =
      store.getState();
    const [{ products, pagination }, categories] = await Promise.all([
      getProducts({
        limit: currentLimit,
        sort: currentSort,
        search: currentSearch,
        page: currentPage,
        category1: selectedCategory1,
        category2: selectedCategory2,
      }),
      getCategories(),
    ]);

    store.dispatch({ type: "SET_CATEGORIES", payload: { categories: categories } });

    if (isInfiniteScroll) {
      store.dispatch({ type: "ADD_PRODUCTS", payload: { products: [...store.getState().products, ...products] } });
    } else {
      store.dispatch({ type: "SET_PRODUCTS", payload: { products: products } });
    }

    store.dispatch({ type: "SET_TOTAL", payload: { total: pagination.total } });
    store.dispatch({
      type: "SET_HAS_MORE",
      payload: { hasMore: store.getState().products.length < store.getState().total },
    });
  } catch (error) {
    console.error("상품 불러오기 오류:", error);
    store.dispatch({ type: "SET_LOADING", payload: { loading: false } });
    store.dispatch({ type: "SET_FETCHING_MORE", payload: { isFetchingMore: false } });
  } finally {
    store.dispatch({ type: "SET_LOADING", payload: { loading: false } });
    store.dispatch({ type: "SET_FETCHING_MORE", payload: { isFetchingMore: false } });
  }
};

const handleScroll = () => {
  if (window.location.pathname !== "/") return;

  if (isThrottled) return;

  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const clientHeight = window.innerHeight;

  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

  if (isNearBottom && !store.getState().isFetchingMore && store.getState().hasMore && !store.getState().loading) {
    fetchAndRenderHomepageData(true);

    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, 500);
  }
};

const handleCategoryFilter = (event) => {
  const targetButton = event.target.closest("[data-breadcrumb], .category2-filter-btn");
  if (!targetButton) return;

  let newCategory1 = store.getState().selectedCategory1;
  let newCategory2 = store.getState().selectedCategory2;

  if (targetButton.dataset.breadcrumb === "reset") {
    newCategory1 = null;
    newCategory2 = null;
  } else if (targetButton.dataset.breadcrumb === "category1") {
    newCategory1 = targetButton.dataset.category1;
    newCategory2 = null;
  } else if (targetButton.classList.contains("category2-filter-btn")) {
    newCategory1 = targetButton.dataset.category1;
    newCategory2 = targetButton.dataset.category2;
  } else {
    return;
  }
  store.dispatch({
    type: "SET_CATEGORIES_FILTER",
    payload: { selectedCategory1: newCategory1, selectedCategory2: newCategory2 },
  });

  fetchAndRenderHomepageData(false);
};

const routes = [
  { path: /^\/$/, view: () => HomePage(store.getState()) },
  { path: /^\/product\/([\w-]+)$/, view: (productId) => ProductPage(productId) },
];

const router = async () => {
  const currentPath = window.location.pathname;
  const root = document.body.querySelector("#root");

  const match = routes
    .map((route) => {
      const match = currentPath.match(route.path);
      if (match) {
        return {
          route,
          result: match,
        };
      }
      return null;
    })
    .find((match) => match !== null);

  if (!match) {
    root.innerHTML = EmptyPage();
    return;
  }

  const params = match.result.slice(1);
  let pageContent;

  if (match.route.path === "/") {
    pageContent = await match.route.view(store.getState());
  } else {
    pageContent = await match.route.view(...params);
  }

  if (root) {
    root.innerHTML = pageContent;
  }

  updateCurrentPageUI();
  attachEventListeners();
};

const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router();
};

const attachEventListeners = () => {
  document.body.removeEventListener("click", handleAddToCart);
  document.body.addEventListener("click", handleAddToCart);

  document.body.removeEventListener("click", handleLinkClick);
  document.body.addEventListener("click", handleLinkClick);

  document.body.removeEventListener("click", handleProductCardClick);
  document.body.addEventListener("click", handleProductCardClick);

  const categoryFilterContainer = document.querySelector(".space-y-3 > .space-y-2");
  if (categoryFilterContainer) {
    categoryFilterContainer.removeEventListener("click", handleCategoryFilter);
    categoryFilterContainer.addEventListener("click", handleCategoryFilter);
  }

  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) {
    limitSelect.value = store.getState().currentLimit.toString();
    limitSelect.onchange = (event) => {
      const newLimit = parseInt(event.target.value);
      store.dispatch({ type: "SET_LIMIT", payload: { currentLimit: newLimit } });
      localStorage.setItem("currentLimit", newLimit.toString());
      fetchAndRenderHomepageData();
    };
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.value = store.getState().currentSort;
    sortSelect.onchange = (event) => {
      const newSort = event.target.value;
      store.dispatch({ type: "SET_SORT", payload: { currentSort: newSort } });
      localStorage.setItem("currentSort", newSort);
      fetchAndRenderHomepageData();
    };
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = store.getState().currentSearch;
    searchInput.oninput = (event) => {
      store.dispatch({ type: "SET_SEARCH_TERM", payload: { currentSearch: event.target.value } });
    };
    searchInput.onkeydown = (event) => {
      if (event.key === "Enter") {
        fetchAndRenderHomepageData();
      }
    };
  }

  window.removeEventListener("scroll", handleScroll);
  window.addEventListener("scroll", handleScroll);
};

const handleProductCardClick = (event) => {
  const productCard = event.target.closest(".product-card");
  if (productCard) {
    const productId = productCard.dataset.productId;
    if (productId) {
      navigateTo(`/product/${productId}`);
    }
  }
};

const handleLinkClick = (event) => {
  const target = event.target.closest("a");
  if (target && target.matches("[data-link]") && target.hostname === window.location.hostname) {
    event.preventDefault();
    navigateTo(target.href);
  }
};

const handleAddToCart = (event) => {
  const targetButton = event.target.closest(".add-to-cart-btn");
  if (!targetButton) return;

  const productId = targetButton.dataset.productId;
  if (!productId) {
    return;
  }

  const productToAdd = store.getState().products.find((p) => p.productId === productId);

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const existingItemIndex = cart.findIndex((item) => item.productId === productId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
    window.alert(`${productToAdd.title} 상품의 수량이 ${cart[existingItemIndex].quantity}개로 변경되었습니다~!`);
  } else {
    cart.push({ ...productToAdd, quantity: 1 });
    window.alert(`${productToAdd.title} 상품이 장바구니에 추가되었습니다!`);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  store.dispatch({
    type: "UPDATE_CART_COUNT",
    payload: { cartItemCount: cart.length },
  });
};

function main() {
  window.addEventListener("popstate", router);

  store.subscribe(() => {
    if (window.location.pathname === "/") {
      router();
    }
  });

  router();

  if (window.location.pathname === "/") {
    fetchAndRenderHomepageData();
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
