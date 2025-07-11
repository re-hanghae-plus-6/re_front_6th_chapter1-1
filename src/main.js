import { HomePage } from "@/pages/Homepage.js";
import { ProductPage } from "@/pages/ProductPage.js";
import { EmptyPage } from "@/pages/EmptyPage.js";
import { getProducts, getCategories } from "@/api/productApi.js";
import { store, resetStoreState } from "@/store.js";

import ProductItem from "@/components/ProductItem.js";

const BASE_URL = "/front_6th_chapter1-1";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      serviceWorker: {
        url: `${BASE_URL}/mockServiceWorker.js`,
        scope: `${BASE_URL}/`,
      },
      onUnhandledRequest: "bypass",
    }),
  );

let isThrottled = false;
let currentSearch = "";

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
    const { currentLimit, currentSort, currentPage, selectedCategory1, selectedCategory2 } = store.getState();
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

    router();
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

const attachProductPageEventListeners = () => {
  const quantityInput = document.getElementById("quantity-input");
  const decreaseBtn = document.getElementById("quantity-decrease");
  const increaseBtn = document.getElementById("quantity-increase");

  if (quantityInput && decreaseBtn && increaseBtn) {
    const MAX_QUANTITY = parseInt(quantityInput.max, 10);

    decreaseBtn.addEventListener("click", () => {
      let value = parseInt(quantityInput.value, 10);
      if (value > 1) {
        quantityInput.value = value - 1;
      }
    });

    increaseBtn.addEventListener("click", () => {
      let value = parseInt(quantityInput.value, 10);
      if (value < MAX_QUANTITY) {
        quantityInput.value = value + 1;
      }
    });

    quantityInput.addEventListener("change", () => {
      let value = parseInt(quantityInput.value, 10);
      if (isNaN(value) || value < 1) {
        quantityInput.value = 1;
      } else if (value > MAX_QUANTITY) {
        quantityInput.value = MAX_QUANTITY;
      }
    });
  }
};

const attachEventListeners = () => {
  document.body.removeEventListener("click", handleAddToCart);
  document.body.addEventListener("click", handleAddToCart);

  document.body.removeEventListener("click", handleAddToCartFromDetail);
  document.body.addEventListener("click", handleAddToCartFromDetail);

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
    searchInput.value = currentSearch;
    searchInput.oninput = (event) => {
      currentSearch = event.target.value;
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
  const productCard = event.target.closest(".product-card, .related-product-card");
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

  let quantityToAdd = 1;

  const productToAdd = store.getState().products.find((p) => p.productId === productId);

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const existingItemIndex = cart.findIndex((item) => item.productId === productId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantityToAdd;
    window.alert(`${productToAdd.title} 상품의 수량이 ${cart[existingItemIndex].quantity}개로 변경되었습니다~!`);
  } else {
    cart.push({ ...productToAdd, quantity: quantityToAdd });
    window.alert(`${productToAdd.title} 상품이 장바구니에 추가되었습니다!`);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  store.dispatch({
    type: "UPDATE_CART_COUNT",
    payload: { cartItemCount: cart.length },
  });
};

const handleAddToCartFromDetail = async (event) => {
  const targetButton = event.target.closest("#add-to-cart-btn");
  if (!targetButton) return;

  const productId = targetButton.dataset.productId;
  if (!productId) {
    console.warn("장바구니에 추가할 상품의 ID를 찾을 수 없습니다.");
    return;
  }

  const quantityInput = document.getElementById("quantity-input");
  let quantityToAdd = 1;
  if (quantityInput) {
    quantityToAdd = parseInt(quantityInput.value, 10);
    if (isNaN(quantityToAdd) || quantityToAdd < 1) {
      quantityToAdd = 1;
    }
  }

  const productToAdd = store.getState().currentDetailProduct;

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existingItemIndex = cart.findIndex((item) => item.productId === productId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantityToAdd;
    window.alert(`${productToAdd.title} 상품의 수량이 ${cart[existingItemIndex].quantity}개로 변경되었습니다~!`);
  } else {
    cart.push({ ...productToAdd, quantity: quantityToAdd });
    window.alert(`${productToAdd.title} 상품이 장바구니에 추가되었습니다!`);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  store.dispatch({
    type: "UPDATE_CART_COUNT",
    payload: { cartItemCount: cart.length },
  });
};

const HOME_PATH_REGEX = /^\/$/;

const routes = [
  { path: HOME_PATH_REGEX, view: () => HomePage(store.getState()) },
  { path: /^\/product\/([\w-]+)$/, view: (productId) => ProductPage(productId) },
];

const router = async () => {
  let currentPath = window.location.pathname;
  const root = document.body.querySelector("#root");

  if (currentPath.startsWith(BASE_URL)) {
    currentPath = currentPath.substring(BASE_URL.length);
  }
  if (currentPath === "" || currentPath === "/") {
    currentPath = "/";
  }

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

  if (currentPath === "/") {
    pageContent = await match.route.view(store.getState());
  } else {
    pageContent = await match.route.view(...params);
  }

  if (root) {
    root.innerHTML = pageContent;
  }

  updateCurrentPageUI();
  attachEventListeners();

  if (currentPath.startsWith("/product/")) {
    attachProductPageEventListeners();
  }
};

const navigateTo = (url) => {
  let targetUrl = BASE_URL + url;
  if (window.location.pathname !== targetUrl) {
    window.history.pushState(null, null, targetUrl);
    router();
  }
};

function main() {
  let currentPath = window.location.pathname;

  if (currentPath.startsWith(BASE_URL)) {
    currentPath = currentPath.substring(BASE_URL.length);
  }
  if (currentPath === "" || currentPath === "/") {
    currentPath = "/";
  }

  window.addEventListener("popstate", () => {
    router();
  });

  store.subscribe(() => {
    if (window.location.pathname === BASE_URL || window.location.pathname === BASE_URL + "/") {
      router();
    }
  });

  router();

  if (currentPath === "/") {
    fetchAndRenderHomepageData();
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
