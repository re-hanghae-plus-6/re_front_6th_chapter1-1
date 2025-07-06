import HomePage from "./pages/HomePage.js";
import { getProducts, getCategories } from "./api/productApi.js";
import { loadCart, updateCartBadge, addToCart, openCartModal } from "./features/cart/index.js";

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
}

let scrollAttached = false;

function setupInfiniteScroll() {
  if (scrollAttached) return;
  scrollAttached = true;

  window.addEventListener("scroll", () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

    if (nearBottom && !state.loading && !state.loadingMore && state.products.length < state.total) {
      loadMore();
    }
  });
}

async function fetchProducts() {
  const { products, pagination } = await getProducts({
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
  const { products: newProducts, pagination } = await getProducts({
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
  loadCart();
  state.loading = true;
  render();

  await Promise.all([fetchProducts(), getCategories().then((c) => (state.categories = c))]);

  state.loading = false;
  render();
  setupInfiniteScroll();
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
