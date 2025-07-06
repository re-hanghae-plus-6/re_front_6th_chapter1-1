import { home } from "./pages/home.js";
import { getProducts } from "./api/productApi.js";
import { getCategories } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

/**
 * 메인 홈페이지 렌더링 및 상태 값
 */
const statusHome = {
  products: [],
  total: 0,
  loading: false,
  categories: [],
};
async function initCategories() {
  statusHome.categories = await getCategories();
  console.log(statusHome.categories);
}
function homeRender() {
  document.body.querySelector("#root").innerHTML = home(statusHome);
}
async function initHome() {
  let data = await getProducts({});
  statusHome.products = data.products;
  statusHome.total = data.pagination.total;
}
async function main() {
  statusHome.loading = true;
  homeRender(statusHome);
  await Promise.all([initHome(), initCategories()]);
  statusHome.loading = false;
  homeRender(statusHome);
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
