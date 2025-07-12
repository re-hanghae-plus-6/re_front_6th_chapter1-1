import ProductListPage from "./pages/ProductListPage.js";
import ProductDetailPage from "./pages/ProductDetailPage.js";
import { cartModal } from "./components/cartModal.js";
import { cartStore } from "./store/cartStore.js";
import { state, setState, subscribe } from "./store/stateStore.js";
import { NotFoundUI } from "./views/NotFountUI.js";
const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

// 라우트 객체 정의
const routes = [
  {
    path: /^\/$/,
    page: "list",
    parse: (match, searchParams) => ({
      limit: searchParams.get("limit"),
      sort: searchParams.get("sort"),
      search: searchParams.get("search"),
      category1: searchParams.get("category1"),
      category2: searchParams.get("category2"),
    }),
  },
  {
    path: /^\/product\/([^/]+)$/,
    page: "detail",
    parse: (match) => ({ productId: match[1] }),
  },
];

function getRoute() {
  const path = getAppPath();
  const searchParams = new URLSearchParams(window.location.search);
  for (const route of routes) {
    const match = path.match(route.path);
    if (match) {
      return { page: route.page, ...route.parse(match, searchParams) };
    }
  }
  return { page: "notfound" };
}

let page;

const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};
const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};
function navigateTo(path) {
  window.history.pushState({}, "", getFullPath(path));
  router();
}

function router() {
  if (!page || page.pageType === "detail") {
    setState({ loading: true });
    // localStorage에서 cart 데이터 로드
  }
  cartStore.loadFromStorage();
  const { openCartModal, updateQuantityInputs, addToCart, renderCartModal } = cartModal({ state, setState });
  subscribe(() => {
    updateQuantityInputs();
    renderCartModal();
  });
  setState({ cart: cartStore.state.cart });
  const route = getRoute();

  if (route.page === "list") {
    setState({
      filters: {
        ...state.filters,
        search: route.search || "",
        sort: route.sort || "price_asc",
        category1: route.category1 || "",
        category2: route.category2 || "",
      },
      pagination: {
        ...state.pagination,
        limit: route.limit ? Number(route.limit) : 20,
      },
    });
    if (page && page.pageType === "list") {
      page.render();
      return;
    }
    page = ProductListPage({ state, setState, openCartModal, addToCart, navigateTo });
    page.pageType = "list";
    subscribe(() => {
      page.render();
    });
    page.createPage();
    return;
  }
  if (page && page.pageType === "list") {
    page.cleanupScrollInfinity();
  }
  if (route.page === "detail") {
    // if (page && page.pageType === "detail" && page.productId === route.productId) {
    //   page.render();
    //   return;
    // }
    page = ProductDetailPage({ state, setState, openCartModal, addToCart, navigateTo });
    page.pageType = "detail";
    page.productId = route.productId;
    subscribe(() => {
      page.render();
    });
    page.createPage({ productId: route.productId });
    return;
  }
  // 라우트가 없으면 404 페이지 표시
  document.getElementById("root").innerHTML = NotFoundUI;
}

// 라우터 설정
function setupRouter() {
  window.addEventListener("popstate", router);
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(() => {
    router();
    setupRouter();
  });
} else {
  router();
  setupRouter();
}
