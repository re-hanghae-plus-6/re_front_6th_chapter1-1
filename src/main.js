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
};

function attachEventListeners() {
  const limitSelect = document.querySelector("#limit-select");
  if (limitSelect) {
    limitSelect.value = String(state.limit);

    limitSelect.onchange = async (e) => {
      const newLimit = Number(e.target.value);
      if (state.limit === newLimit) return;

      state.limit = newLimit;
      state.page = 1;
      state.products = [];
      state.loading = true;
      render();

      const {
        products,
        pagination: { total },
      } = await getProducts({ limit: state.limit, page: state.page });

      state.products = products;
      state.total = total;
      state.loading = false;
      render();
    };
  }

  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.onclick = () => {
      const product = state.products.find((p) => p.productId === btn.dataset.productId);
      addToCart(product);
    };
  });

  document.querySelector("#cart-icon-btn")?.addEventListener("click", openCartModal);
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

async function loadMore() {
  state.loadingMore = true;
  render();

  const nextPage = state.page + 1;
  const {
    products: newProducts,
    pagination: { total },
  } = await getProducts({ limit: state.limit, page: nextPage });

  state.products = [...state.products, ...newProducts];
  state.total = total;
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

  const [
    {
      products,
      pagination: { total },
    },
    categories,
  ] = await Promise.all([getProducts({ limit: state.limit, page: state.page }), getCategories()]);

  state.products = products;
  state.total = total;
  state.categories = categories;
  state.loading = false;
  render();

  setupInfiniteScroll();
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
