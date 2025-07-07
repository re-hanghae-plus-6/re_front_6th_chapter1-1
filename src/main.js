import { LoadingContent, ProductContent, toast } from "./pages/components.js";
import { debounce } from "./utils.js";
const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let pageState = {
  hasNext: false,
  hasPrev: false,
  limit: 20,
  page: 1,
  total: 0,
  totalPages: 0,
};

let filterState = {
  category1: "",
  category2: "",
  search: "",
  sort: "price_asc",
};

let state = {
  isLoading: false,
  isFetching: false,
  error: null,
  products: [],
};

async function getProducts(searchState) {
  state.isLoading = true;
  render();
  const params = new URLSearchParams(searchState);
  try {
    const response = await fetch(`/api/products?${params.toString()}`);
    if (!response.ok) throw new Error("네트워크 오류");
    const data = await response.json();
    const { products, pagination, filters } = data;
    state.products = [...state.products, ...products];
    pageState = { ...pageState, ...pagination };
    filterState = { ...filterState, ...filters };
    // console.log(data);
    state.error = null;
  } catch (error) {
    state.error = error.message;
  } finally {
    state.isLoading = false;
    render();
  }
}

function render() {
  const root = document.getElementById("root");
  if (state.isLoading) {
    root.innerHTML = LoadingContent();
  } else if (state.products) {
    root.innerHTML = ProductContent(state.products, { ...filterState, ...pageState });
  }
  if (state.error) {
    root.innerHTML = toast("error");
  }
}

function setEventListener() {
  const debouncedGetProducts = debounce(() => {
    getProducts(filterState);
  }, 1500);

  document.getElementById("root").addEventListener("input", (e) => {
    if (e.target && e.target.id === "search-input") {
      filterState.search = e.target.value;
      debouncedGetProducts();
    }
  });

  document.getElementById("root").addEventListener("change", (e) => {
    if (e.target && e.target.id === "limit-select") {
      pageState.limit = parseInt(e.target.value, 10);
      getProducts(pageState);
    }
  });

  document.getElementById("root").addEventListener("change", (e) => {
    if (e.target && e.target.id === "sort-select") {
      filterState.sort = e.target.value;
      getProducts(filterState);
    }
  });

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    if (
      scrollTop + windowHeight >= documentHeight - 10 &&
      !state.isFetching &&
      pageState.hasNext // 다음 페이지가 있을 때만 요청
    ) {
      state.isFetching = true;
      pageState.page += 1; // pageState에 page가 있으므로 여기서 증가
      getProducts();
    }
  });
}

function main() {
  getProducts(filterState);
  setEventListener();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
