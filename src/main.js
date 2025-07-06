import { getCategories, getProducts } from "./api/productApi.js";
import HomPage from "./pages/HomePage/index.js";

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
  limit: "20",
  categories: [],
  cart: [],
};

const setState = (newState) => {
  state = { ...state, ...newState };
  render();
};

function render() {
  document.body.querySelector("#root").innerHTML = HomPage(state);
}

function initEventListeners() {
  const root = document.querySelector("#root");

  root.addEventListener("change", async (event) => {
    const { target } = event;

    if (target.id === "limit-select") {
      const newLimit = target.value;
      setState({ limit: newLimit });

      try {
        const data = await getProducts({ limit: newLimit });
        setState({ products: data.products, total: data.pagination.limit });
      } catch (error) {
        console.error("상품 로딩 실패:", error);
      }
    }
  });
}

async function main() {
  setState({ loading: true });

  initEventListeners();

  const data = await getProducts({ limit: state.limit });
  setState({
    products: data.products,
    total: data.pagination.limit,
    loading: false,
  });

  const category = await getCategories();
  setState({ categories: category });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
