import { HomePage } from "./pages/Homepage.js";
import { getProducts, getCategories } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let currentLimit = 20;
let currentSort = "price_asc";

let state = {
  categories: {},
  products: [],
  total: 0,
  loading: false,
};

const fetchAndRenderHomepage = async () => {
  state.loading = true;
  render();

  try {
    const [{ products, pagination }, categories] = await Promise.all([
      getProducts({
        limit: currentLimit,
        sort: currentSort,
      }),
      getCategories(),
    ]);
    state.categories = categories;
    state.products = products;
    state.total = pagination.total;
  } catch (error) {
    console.error(error);
  }

  state.loading = false;
  render();
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
};

const render = () => {
  const root = document.body.querySelector("#root");

  if (root) {
    root.innerHTML = HomePage(state);

    attachEventListeners();
  }
};

function main() {
  fetchAndRenderHomepage();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
