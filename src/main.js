import { createProductListPage } from "./pages";
import mockItems from "./mocks/items.json";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  const root = document.getElementById("root");

  const products = mockItems.slice(0, 20);

  root.innerHTML = createProductListPage(products, {
    totalCount: mockItems.length,
    isLoading: false,
    searchValue: "",
    selectedLimit: "20",
    selectedSort: "price_asc",
  });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
