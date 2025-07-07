import { LoadingContent, ProductContent, toast } from "./pages/components.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );
let state = {
  isLoading: false,
  error: null,
  products: [],
};
async function getProducts() {
  state.isLoading = true;
  render();
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("네트워크 오류");
    const data = await response.json();
    state.products = data.products;
    state.error = null;
  } catch (error) {
    state.error = error.message;
  }
  state.isLoading = false;
  render();
}
function render() {
  const root = document.getElementById("root");
  if (state.isLoading) {
    root.innerHTML = LoadingContent();
  }
  if (state.products) {
    root.innerHTML = ProductContent();
  }
  if (state.error) {
    root.innerHTML = toast("error");
  }
}
function main() {
  getProducts();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
