import { home } from "./pages/home.js";
import { searchNcategoriesComp } from "./components/searchNcategoriesComp.js";
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
  params: {
    limit: 20,
  },
  categories: {},
};
// 카테고리 객체
async function initCategories() {
  statusHome.categories = await getCategories();
}
async function initList() {
  let data = await getProducts({});
  statusHome.products = data.products;
  statusHome.total = data.pagination.total;
}
// 홈 렌더링
function homeRender() {
  document.body.querySelector("#root").innerHTML = home(statusHome);
}
// 카테고리 렌더링
function categoriesRender(statusHome) {
  const filterCompEl = document.body.querySelector("#filterComp");
  console.log(filterCompEl);

  if (filterCompEl) {
    filterCompEl.innerHTML = searchNcategoriesComp(statusHome);
  }
}
// API 호출 및 렌더링을 담당하는 함수
async function loadProductsAndUpdateUI() {
  statusHome.loading = true;
  homeRender(); // 로딩 상태의 UI를 먼저 렌더링
  // 카테고리 로드
  await initCategories();
  categoriesRender(statusHome);
  await initList();
  statusHome.loading = false;
  homeRender(); // 데이터 로딩 후 다시 렌더링
  categoriesRender(statusHome);
}
// 이벤트 핸들러 설정 함수
function setupEventListeners() {
  const filterCompEl = document.body.querySelector("#filterComp");
  if (filterCompEl) {
    filterCompEl.addEventListener("change", (e) => {
      if (e.target.id === "limit-select") {
        const newLimit = parseInt(e.target.value, 10);
        statusHome.params.limit = newLimit;
        loadProductsAndUpdateUI();
      }
    });
  }
  // TODO: 그 외 다른 이벤트 설정.....
}

async function main() {
  // 상품 데이터 로드
  await loadProductsAndUpdateUI();
  // 이벤트 리스너 설정
  setupEventListeners();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
