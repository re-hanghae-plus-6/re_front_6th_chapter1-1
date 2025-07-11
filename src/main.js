import { productListPage } from "./pages/productListPage.js";
import { getProducts, getCategories } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    }),
  );

const state = {
  products: [],
  total: 0,
  loading: false,
  categories: {},
};

function getQueryParams() {
  const urlParams = new URLSearchParams(location.search);
  return {
    limit: parseInt(urlParams.get("limit")) || 20,
    sort: urlParams.get("sort") || "price_asc",
  };
}

function updateURL(params) {
  const urlParams = new URLSearchParams(location.search);
  Object.entries(params).forEach(([key, value]) => {
    urlParams.set(key, value);
  });
  history.pushState(null, "", `?${urlParams.toString()}`);
}

function attachEventListeners() {
  document.body.addEventListener("change", async (e) => {
    if (e.target.id === "limit-select" || e.target.id === "sort-select") {
      const urlParams = new URLSearchParams(location.search);
      const currentLimit = parseInt(urlParams.get("limit")) || 20;
      const currentSort = urlParams.get("sort") || "price_asc";

      // 변경된 값만 읽음
      const newLimit = e.target.id === "limit-select" ? parseInt(e.target.value) : currentLimit;
      const newSort = e.target.id === "sort-select" ? e.target.value : currentSort;

      // URL 업데이트
      updateURL({ limit: newLimit, sort: newSort });

      state.loading = true;
      render();

      const [
        {
          products,
          pagination: { total },
        },
      ] = await Promise.all([getProducts({ limit: newLimit, sort: newSort })]);

      state.products = products;
      state.total = total;
      state.loading = false;

      render();
    }
  });
}

function render() {
  const { limit, sort } = getQueryParams();
  document.body.querySelector("#root").innerHTML = productListPage({ ...state, limit, sort });
}

async function main() {
  state.loading = true;
  render();
  // const data = await getProducts({});
  // const [product, categories] = await Promise.all[(getProducts({}), getCategories())];

  const { limit, sort } = getQueryParams();

  const [
    {
      products,
      pagination: { total },
    },
    categories,
  ] = await Promise.all([getProducts({ limit, sort }), getCategories()]);

  state.products = products;
  state.total = total;
  state.categories = categories;
  state.loading = false;

  render();
  attachEventListeners();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
