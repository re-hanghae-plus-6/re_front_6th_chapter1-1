import { LoadingContent, ProductContent, toast } from "./pages/components.js";
import { debounce } from "./utils.js";
const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let searchState = {
  page: 1,
  limit: 20,
  search: "",
  sort: "price_asc",
  category1: "",
  category2: "",
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
    state.products = [...state.products, ...data.products];
    console.log(data.products);
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
    root.innerHTML = ProductContent(state.products, searchState);
  }
  if (state.error) {
    root.innerHTML = toast("error");
  }
}
function setEventListener() {
  const debouncedGetProducts = debounce(() => {
    getProducts(searchState);
  }, 1500);

  document.getElementById("root").addEventListener("input", (e) => {
    if (e.target && e.target.id === "search-input") {
      searchState.search = e.target.value;
      debouncedGetProducts();
    }
  });

  document.getElementById("root").addEventListener("change", (e) => {
    if (e.target && e.target.id === "limit-select") {
      searchState.limit = parseInt(e.target.value, 10);
      getProducts(searchState);
    }
  });

  document.getElementById("root").addEventListener("change", (e) => {
    if (e.target && e.target.id === "sort-select") {
      searchState.sort = e.target.value;
      getProducts(searchState);
    }
  });

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY; // 현재 스크롤 위치
    const windowHeight = window.innerHeight; // 브라우저 창 높이
    const documentHeight = document.body.scrollHeight; // 전체 문서 높이
    if (scrollTop + windowHeight >= documentHeight - 10 && !state.isFetching) {
      state.isFetching = true;
      searchState.page = searchState.page + 1;
      getProducts(searchState);
    }
  });
}

function main() {
  getProducts(searchState);
  setEventListener();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
