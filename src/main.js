import { searchNcategoriesComp } from "./components/searchNcategoriesComp.js";
import { getProducts, getCategories } from "./api/productApi.js";
import { createRouter } from "./router.js"; // 라우터 임포트

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

/**
 * 메인 홈페이지 렌더링 및 상태 값
 */
const mainStatus = {
  products: [],
  total: 0,
  loading: false,
  params: {
    limit: 20,
  },
  categories: {},
};

// 라우터 인스턴스를 전역적으로 접근 가능하도록 선언
let appRouter;

// 카테고리 객체
async function initCategories() {
  mainStatus.categories = await getCategories();
}
async function initList() {
  let data = await getProducts({ limit: mainStatus.params.limit });
  mainStatus.products = data.products;
  mainStatus.total = data.pagination.total;
}
// 카테고리 렌더링
function categoriesRender(mainStatus) {
  const filterCompEl = document.body.querySelector("#filterComp");
  console.log(filterCompEl);

  if (filterCompEl) {
    filterCompEl.innerHTML = searchNcategoriesComp(mainStatus);
  }
}
// API 호출 및 렌더링을 담당하는 함수
async function loadProductsAndUpdateUI() {
  mainStatus.loading = true;
  // 라우터에게 상태 업데이트 및 재렌더링 요청 (로딩 상태 반영)
  appRouter.updateStateAndRender(mainStatus);

  // 카테고리 로드
  await initCategories();
  categoriesRender(mainStatus);
  await initList();
  mainStatus.loading = false;
  // 라우터에게 최종 상태 업데이트 및 재렌더링 요청 (데이터 로딩 완료 반영)
  appRouter.updateStateAndRender(mainStatus);
  categoriesRender(mainStatus);
}
// 이벤트 핸들러 설정 함수
function setupEventListeners() {
  const filterCompEl = document.body.querySelector("#filterComp");
  if (filterCompEl) {
    filterCompEl.addEventListener("change", (e) => {
      if (e.target.id === "limit-select") {
        const newLimit = parseInt(e.target.value, 10);
        mainStatus.params.limit = newLimit;
        loadProductsAndUpdateUI();
      }
    });
  }
  // TODO: 그 외 다른 이벤트 설정.....
}

async function main() {
  // 라우터 초기화: mainStatus 객체를 라우터에 전달하여 라우터가 상태를 관리하도록 함
  appRouter = createRouter(mainStatus);

  // 초기 데이터 로드 및 UI 업데이트
  // 라우터가 DOMContentLoaded에서 초기 렌더링을 처리하므로,
  // 여기서는 데이터만 로드하고, 라우터가 home 컴포넌트를 렌더링할 때
  // mainStatus을 사용하도록 합니다.
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
