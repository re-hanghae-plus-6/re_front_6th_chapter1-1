import HomePage from "./pages/HomePage.js";
import productService from "./services/ProductService.js";
import { updateCartBadge, addToCart, openCartModal } from "./features/cart/index.js";
import router from "./router/Router.js";
import InfiniteScrollManager from "./services/InfiniteScrollManager.js";
import homePageController from "./controllers/HomePageController.js";
import productDetailController from "./controllers/ProductDetailController.js";
import NotFoundPage from "./pages/NotFoundPage.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let state = {
  products: [],
  total: 0,
  loading: false,
  loadingMore: false,
  categories: {},
  limit: 20,
  page: 1,
  cart: {},
  search: "",
  category1: "",
  category2: "",
};

function attachEventListeners() {
  const limitSelect = document.querySelector("#limit-select");
  if (limitSelect) {
    limitSelect.value = String(state.limit);

    limitSelect.onchange = async (e) => {
      state.limit = Number(e.target.value);
      state.page = 1;
      fetchProductsAndRender();
    };
  }

  const searchInput = document.querySelector("#search-input");
  if (searchInput) {
    searchInput.value = state.search;

    searchInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        const keyword = searchInput.value.trim();
        if (state.search !== keyword) {
          state.search = keyword;
          state.page = 1;
          fetchProductsAndRender();
        }
      }
    };
  }

  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.onclick = () => {
      const product = state.products.find((p) => String(p.productId) === btn.dataset.productId);
      if (product) addToCart(product);
    };
  });

  document.querySelector("#cart-icon-btn")?.addEventListener("click", openCartModal);

  document.querySelectorAll(".category1-filter-btn").forEach((btn) => {
    btn.onclick = () => {
      state.category1 = btn.dataset.category1;
      state.category2 = "";
      state.page = 1;
      fetchProductsAndRender();
    };
  });
  document.querySelectorAll(".category2-filter-btn").forEach((btn) => {
    btn.onclick = () => {
      state.category1 = btn.dataset.category1;
      state.category2 = btn.dataset.category2;
      state.page = 1;
      fetchProductsAndRender();
    };
  });
  document.querySelector('[data-breadcrumb="reset"]')?.addEventListener("click", () => {
    state.category1 = "";
    state.category2 = "";
    state.page = 1;
    fetchProductsAndRender();
  });
  document.querySelector('[data-breadcrumb="category1"]')?.addEventListener("click", (e) => {
    state.category1 = e.target.dataset.category1;
    state.category2 = "";
    state.page = 1;
    fetchProductsAndRender();
  });

  document.querySelectorAll(".product-image, .product-info").forEach((el) => {
    el.onclick = () => {
      const card = el.closest(".product-card");
      const pid = card.dataset.productId;
      navigate(`/product/${pid}`);
    };
  });
}

let scrollManager;

export function setupInfiniteScroll() {
  if (scrollManager) return;
  scrollManager = new InfiniteScrollManager(async () => {
    if (!state.loading && !state.loadingMore && state.products.length < state.total) {
      await loadMore();
    }
  });
  scrollManager.attach();
}

async function fetchProducts() {
  const { products, pagination } = await productService.getProducts({
    limit: state.limit,
    page: state.page,
    search: state.search,
    category1: state.category1,
    category2: state.category2,
  });
  state.products = products;
  state.total = pagination.total;
}

async function fetchProductsAndRender() {
  state.loading = true;
  render();
  await fetchProducts();
  state.loading = false;
  render();
}

async function loadMore() {
  state.loadingMore = true;
  render();

  const nextPage = state.page + 1;
  const { products: newProducts, pagination } = await productService.getProducts({
    limit: state.limit,
    page: nextPage,
    search: state.search,
    category1: state.category1,
    category2: state.category2,
  });

  state.products = [...state.products, ...newProducts];
  state.total = pagination.total;
  state.page = nextPage;
  state.loadingMore = false;
  render();
}

function render() {
  document.body.querySelector("#root").innerHTML = HomePage(state);
  attachEventListeners();
  updateCartBadge();
}

async function main() {
  // 초깃값 렌더링은 컨트롤러/라우터가 담당
  router.handle(window.location.pathname);
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}

function navigate(path) {
  router.navigate(path);
}

// 라우트 등록 (컨트롤러 활용)
router.add("/", () => {
  homePageController.init();
});
router.add("/product/:id", async ({ id }) => {
  await productDetailController.show(id);
});
router.setNotFound(() => {
  document.querySelector("#root").innerHTML = NotFoundPage();
});
