import { HomePage } from "./pages/Homepage.js";
import { ProductPage } from "./pages/ProductPage.js";
import { getProducts, getCategories } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let state = {
  categories: {},
  products: [],
  total: 0,
  loading: false,
  isFetchingMore: false,
  hasMore: true,
  selectedCategory1: null,
  selectedCategory2: null,
  cartItemCount: 0,
  currentLimit: 20,
  currentSort: "price_asc",
  currentSearch: "",
  currentPage: 1,
};

let isThrottled = false;

const fetchAndRenderHomepage = async (isInfiniteScroll = false) => {
  if (isInfiniteScroll) {
    if (!state.hasMore || state.isFetchingMore) {
      return;
    }
    state.isFetchingMore = true;
    state.currentPage++;
  } else {
    state.loading = true;
    state.currentPage = 1;
    state.products = [];
    state.hasMore = true;
  }

  render();

  try {
    const [{ products, pagination }, categories] = await Promise.all([
      getProducts({
        limit: state.currentLimit,
        sort: state.currentSort,
        search: state.currentSearch,
        page: state.currentPage,
        category1: state.selectedCategory1,
        category2: state.selectedCategory2,
      }),
      getCategories(),
    ]);

    state.categories = categories;

    if (isInfiniteScroll) {
      state.products = [...state.products, ...products];
    } else {
      state.products = products;
    }

    state.total = pagination.total;
    state.hasMore = state.products.length < state.total;
  } catch (error) {
    console.error(error);
  } finally {
    state.loading = false;
    state.isFetchingMore = false;
    render();
  }
};

const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router();
};

const handleLinkClick = (event) => {
  const target = event.target.closest("a");

  if (target && target.matches("[data-link]") && target.hostname === window.location.hostname) {
    event.preventDefault();
    navigateTo(target.href);
  }
};

const handleScroll = () => {
  if (window.location.pathname !== "/") return;

  if (isThrottled) return;

  // 스크롤 위치 계산
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const clientHeight = window.innerHeight;

  // 사용자가 페이지 하단 100px에 도달했는지 확인
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

  if (isNearBottom && !state.isFetchingMore && state.hasMore && !state.loading) {
    fetchAndRenderHomepage(true);

    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, 500);
  }
};

const handleCategoryFilter = (event) => {
  const targetButton = event.target.closest("[data-breadcrumb], .category2-filter-btn");
  if (!targetButton) return;

  if (targetButton.dataset.breadcrumb === "reset") {
    state.selectedCategory1 = null;
    state.selectedCategory2 = null;
  } else if (targetButton.dataset.breadcrumb === "category1") {
    state.selectedCategory1 = targetButton.dataset.category1;
    state.selectedCategory2 = null;
  } else if (targetButton.classList.contains("category2-filter-btn")) {
    state.selectedCategory1 = targetButton.dataset.category1;
    state.selectedCategory2 = targetButton.dataset.category2;
  } else {
    return;
  }

  fetchAndRenderHomepage(false);
};

const attachEventListeners = () => {
  const limitSelect = document.getElementById("limit-select");

  if (limitSelect) {
    limitSelect.value = state.currentLimit.toString();

    limitSelect.onchange = (event) => {
      state.currentLimit = parseInt(event.target.value);
      fetchAndRenderHomepage();
    };
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.value = state.currentSort;
    sortSelect.onchange = (event) => {
      state.currentSort = event.target.value;
      fetchAndRenderHomepage();
    };
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = state.currentSearch;
    searchInput.oninput = (event) => {
      state.currentSearch = event.target.value;
    };
  }
  searchInput.onkeydown = (event) => {
    if (event.key === "Enter") {
      fetchAndRenderHomepage();
    }
  };

  window.removeEventListener("scroll", handleScroll);
  window.addEventListener("scroll", handleScroll);

  document.body.removeEventListener("click", handleLinkClick);
  document.body.addEventListener("click", handleLinkClick);

  const categoryFilterContainer = document.querySelector(".space-y-3 > .space-y-2");
  if (categoryFilterContainer) {
    categoryFilterContainer.removeEventListener("click", handleCategoryFilter);
    categoryFilterContainer.addEventListener("click", handleCategoryFilter);
  }
};

const routes = [
  { path: /^\/$/, view: () => HomePage(state) },
  { path: /^\/product\/(\w+)$/, view: (productId) => ProductPage(productId) },
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
    root.innerHTML = `404`;
    return;
  }

  const params = match.result.slice(1);
  const pageContent = await match.route.view(...params);

  if (root) {
    root.innerHTML = pageContent;
  }

  attachEventListeners();
};

const render = () => {
  const root = document.body.querySelector("#root");

  if (root) {
    root.innerHTML = HomePage(state);

    attachEventListeners();
  }
};

function main() {
  window.addEventListener("popstate", router);
  router();

  if (window.location.pathname === "/") {
    fetchAndRenderHomepage();
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
