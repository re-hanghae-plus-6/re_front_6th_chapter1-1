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
  limit: 20,
  sort: "price_asc",
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
        console.log("새로운 limit:", newLimit);
        const data = await getProducts({ limit: newLimit });
        setState({ products: data.products, limit: newLimit });
      } catch (error) {
        console.error("상품 로딩 실패:", error);
      }
    }

    if (target.id === "sort-select") {
      const newSort = target.value;
      setState({ sort: newSort });

      try {
        const data = await getProducts({ sort: newSort });
        setState({ products: data.products, sort: newSort });
      } catch (error) {
        console.error("상품 정렬 실패:", error);
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
    total: data.pagination.total,
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
