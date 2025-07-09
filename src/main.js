import { HomePage } from "./pages/Homepage.js";
import { ProductPage } from "./pages/ProductPage.js";
import { getProducts, getCategories } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let currentPage = 1;
let currentLimit = 20;
let currentSort = "price_asc";
let currentSearch = "";

let state = {
  categories: {},
  products: [],
  total: 0,
  loading: false,
  isFetchingMore: false,
  hasMore: true,
};

let isThrottled = false;

const fetchAndRenderHomepage = async (isInfiniteScroll = false) => {
  if (isInfiniteScroll) {
    if (!state.hasMore || state.isFetchingMore) {
      return;
    }
    state.isFetchingMore = true;
    currentPage++;
  } else {
    state.loading = true;
    currentPage = 1;
    state.products = [];
    state.hasMore = true;
  }

  render();

  try {
    const [{ products, pagination }, categories] = await Promise.all([
      getProducts({
        limit: currentLimit,
        sort: currentSort,
        search: currentSearch,
        page: currentPage,
      }),
      // 카테고리 한 번만 불러오거나, 변경될 때만 불러오도록 최적화 하기
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

const attachEventListeners = () => {
  const limitSelect = document.getElementById("limit-select");

  if (limitSelect) {
    limitSelect.value = currentLimit.toString();

    limitSelect.onchange = (event) => {
      currentLimit = parseInt(event.target.value);
      fetchAndRenderHomepage();
    };
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.value = currentSort;
    sortSelect.onchange = (event) => {
      currentSort = event.target.value;
      fetchAndRenderHomepage();
    };
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = currentSearch;
    searchInput.oninput = (event) => {
      currentSearch = event.target.value;
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
