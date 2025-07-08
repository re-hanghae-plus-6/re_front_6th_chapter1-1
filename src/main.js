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
  loading: true, // 초기 로딩 상태
  params: {
    page: 1,
    limit: 20,
    search: "",
    category1: "",
    category2: "",
    sort: "price_asc",
  },
  categories: {},
};

// 라우터 인스턴스를 전역적으로 접근 가능하도록 선언
let appRouter;

// API 호출 및 렌더링을 담당하는 함수
async function loadProductsAndUpdateUI() {
  mainStatus.loading = true;
  appRouter.updateStateAndRender(mainStatus); // 로딩 상태 먼저 반영

  try {
    // 카테고리와 제품 목록을 동시에 요청하여 성능 최적화
    const [categories, productsData] = await Promise.all([getCategories(), getProducts(mainStatus.params)]);

    mainStatus.categories = categories;
    mainStatus.products = productsData.products;
    mainStatus.total = productsData.pagination.total;
  } catch (error) {
    console.error("loadProductsAndUpdateUI", "데이터를 불러오는 중 오류가 발생했습니다:", error);
  } finally {
    mainStatus.loading = false;
    appRouter.updateStateAndRender(mainStatus); // 최종 상태 반영
  }
}

// 이벤트 핸들러 설정 함수
function setupEventListeners() {
  /** change */
  document.body.addEventListener("change", (e) => {
    const target = e.target;
    let shouldUpdate = false;

    if (target.id === "limit-select") {
      mainStatus.params.limit = parseInt(target.value, 10);
      shouldUpdate = true;
    } else if (target.id === "sort-select") {
      mainStatus.params.sort = target.value;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      mainStatus.params.page = 1; // 필터 변경 시 첫 페이지로 초기화
      loadProductsAndUpdateUI();
    }
  });

  // TODO: 그 외 다른 이벤트 설정.....
}

async function main() {
  // 라우터 초기화: mainStatus 객체를 라우터에 전달하여 라우터가 상태를 관리하도록 함
  appRouter = createRouter(mainStatus);

  // 초기 데이터 로드 및 UI 업데이트
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
