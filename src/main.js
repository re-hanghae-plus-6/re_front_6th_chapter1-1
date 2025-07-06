import { home } from "./pages/home.js";
import { categoriesComp } from "./components/categoriesComp.js";
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
};
let categories = {};
async function initCategories() {
  categories = await getCategories();
}
function homeRender() {
  document.body.querySelector("#root").innerHTML = home(statusHome);
}
function categoriesRender(categoriesData) {
  document.body.querySelector("#categories").innerHTML = categoriesComp(categoriesData, statusHome.loading);
}
async function initHome() {
  let data = await getProducts({});
  statusHome.products = data.products;
  statusHome.total = data.pagination.total;
}
async function main() {
  // 1. 초기 로딩 상태 설정 및 UI 렌더링
  statusHome.loading = true;
  homeRender(statusHome); // 상품 스켈레톤 및 searchFilter div 포함한 전체 홈 UI 렌더링
  categoriesRender(categories); // searchFilter div에 초기 카테고리 (로딩 메시지) 렌더링

  // 2. 비동기 데이터 로딩
  await Promise.all([initHome(), initCategories()]);

  // 3. 데이터 로딩 완료 후 UI 업데이트
  statusHome.loading = false;
  homeRender(statusHome); // 로드된 상품 데이터로 전체 홈 UI 다시 렌더링
  categoriesRender(categories); // 로드된 카테고리 데이터로 searchFilter div 업데이트
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
