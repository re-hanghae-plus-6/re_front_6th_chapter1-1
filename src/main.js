import { createProductListPage } from "./pages";
import { getProducts } from "./api";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

async function main() {
  const root = document.getElementById("root");

  root.innerHTML = createProductListPage([], {
    totalCount: 0,
    isLoading: true,
    searchValue: "",
    selectedLimit: "20",
    selectedSort: "price_asc",
  });

  const { products, totalCount } = await getProducts({
    page: 1,
    limit: 20,
    sort: "price_asc",
  });

  root.innerHTML = createProductListPage(products, {
    totalCount,
    isLoading: false,
    searchValue: "",
    selectedLimit: "20",
    selectedSort: "price_asc",
  });
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
