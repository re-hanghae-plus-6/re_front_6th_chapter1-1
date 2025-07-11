import Footer from "./shared/ui/footer";
import Header from "./components/Header";
import ListPage from "./pages/ListPage";
import { getProducts } from "./api/productApi.js";

const enableMocking = () => {
  return import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );
};

let state = {
  products: [],
  total: 0,
  loading: false,
};

function render() {
  document.body.querySelector("#root").innerHTML = `
  <div class="bg-gray-50">
    ${Header}
    ${ListPage(state)}
    ${Footer}
  </div>
  `;
}

async function main() {
  state.loading = true;
  render();
  const data = await getProducts({ limit: 20 });
  state.products = data.products;
  state.total = data.pagination.total;
  state.loading = false;
  render();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
