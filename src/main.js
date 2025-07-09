import { createProductListPage } from "./pages/index.js";
import { productListService } from "./services/index.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function render(state) {
  const root = document.getElementById("root");
  root.innerHTML = createProductListPage(state.products, state);
}

function setupEventListeners() {
  const root = document.getElementById("root");

  // 검색 이벤트
  root.addEventListener("keydown", async (e) => {
    if (e.target.id === "search-input" && e.key === "Enter") {
      await productListService.search(e.target.value);
    }
  });

  // 정렬 변경 이벤트
  root.addEventListener("change", async (e) => {
    if (e.target.id === "sort-select") {
      await productListService.changeSort(e.target.value);
    }
    if (e.target.id === "limit-select") {
      await productListService.changeLimit(e.target.value);
    }
  });

  // 카테고리 필터 이벤트
  root.addEventListener("click", async (e) => {
    if (e.target.classList.contains("category1-filter-btn")) {
      const category1 = e.target.dataset.category1;
      await productListService.changeCategory(category1);
    }
    if (e.target.classList.contains("category2-filter-btn")) {
      const category1 = e.target.dataset.category1;
      const category2 = e.target.dataset.category2;
      await productListService.changeCategory(category1, category2);
    }
    if (e.target.dataset.breadcrumb === "reset") {
      await productListService.resetFilters();
    }
    if (e.target.dataset.breadcrumb === "category1") {
      const category1 = e.target.dataset.category1;
      await productListService.changeCategory(category1);
    }
  });

  // 무한 스크롤 이벤트
  window.addEventListener("scroll", async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
      await productListService.loadNextPage();
    }
  });

  // 브라우저 뒤로가기/앞으로가기 이벤트
  window.addEventListener("popstate", async () => {
    await productListService.loadProducts(true);
  });
}

async function main() {
  // 상태 변경 리스너 등록
  productListService.addListener(render);

  // 이벤트 리스너 설정
  setupEventListeners();

  // 초기 상품 목록 로드
  await productListService.loadProducts(true);
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
