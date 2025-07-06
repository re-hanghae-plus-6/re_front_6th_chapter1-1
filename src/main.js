import { getProducts, getCategories } from "./api/productApi.js";
import FilterSection from "./components/filter/FilterSection.js";
import ProductGrid from "./components/product/ProductGrid.js";
import createStateManager from "./store/createStateManater.js";
import MainLayout from "./components/layout/MainLayout.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

const initialState = {
  products: [],
  categories: [],
  total: 0,
  loading: false,
  categoriesLoading: false,
  searchValue: "",
  selectedCategory1: "",
  selectedCategory2: "",
  selectedSort: "price_asc",
  selectedLimit: "20",
  currentPage: 1,
  hasMore: true,
  scrollLoading: false,
};

const stateManager = createStateManager(initialState);
stateManager.subscribe(render);

function router() {
  const path = window.location.pathname;
  if (path === "/" || path === "") {
    render();
  }
}

function render() {
  const state = stateManager.getState();
  const {
    products,
    categories,
    total,
    loading,
    categoriesLoading,
    searchValue,
    selectedCategory1,
    selectedCategory2,
    selectedSort,
    selectedLimit,
    hasMore,
  } = state;

  const $root = document.getElementById("root");
  // 상품 로딩 완료 상태
  $root.innerHTML = MainLayout({
    children: `
    ${FilterSection({
      searchValue,
      categories,
      selectedCategory1,
      selectedCategory2,
      selectedSort,
      selectedLimit,
      isLoading: categoriesLoading,
    })}

    ${ProductGrid({
      products,
      totalCount: total,
      isLoading: loading,
      hasMore,
    })}
  `,
    cartCount: 0,
    showBackButton: false,
    title: "상품 목록",
  });
  // 렌더링 후 이벤트 리스너 연결
  attachEventListeners();
}

// 이벤트 리스너 등록
function attachEventListeners() {
  // 무한 스크롤 이벤트 리스너

  // 검색 기능
  const searchInput = document.querySelector("#search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        stateManager.setState({
          searchValue: e.target.value,
          currentPage: 1,
          hasMore: true,
        });
      }
    });
  }

  // 페이지당 상품 수 변경
  const limitSelect = document.querySelector("#limit-select");
  if (limitSelect) {
    limitSelect.addEventListener("change", (e) => {
      stateManager.setState({
        selectedLimit: e.target.value,
        currentPage: 1,
        hasMore: true,
      });
    });
  }

  // 정렬 변경
  const sortSelect = document.querySelector("#sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      stateManager.setState({
        selectedSort: e.target.value,
        currentPage: 1,
        hasMore: true,
      });
    });
  }

  // 카테고리 필터
  const category1Buttons = document.querySelectorAll("[data-category1]:not([data-category2])");
  category1Buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const category1 = e.target.getAttribute("data-category1");
      stateManager.setState({
        selectedCategory1: category1,
        selectedCategory2: "",
        currentPage: 1,
        hasMore: true,
      });
    });
  });

  // 2차 카테고리 필터
  const category2Buttons = document.querySelectorAll("[data-category2]");
  category2Buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const category1 = e.target.getAttribute("data-category1");
      const category2 = e.target.getAttribute("data-category2");
      stateManager.setState({
        selectedCategory1: category1,
        selectedCategory2: category2,
        currentPage: 1,
        hasMore: true,
      });
    });
  });

  // 브레드크럼 리셋
  const resetButton = document.querySelector("[data-breadcrumb='reset']");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      stateManager.setState({
        selectedCategory1: "",
        selectedCategory2: "",
        searchValue: "",
        currentPage: 1,
        hasMore: true,
      });

      // 검색 입력 필드도 초기화
      const searchInput = document.querySelector("#search-input");
      if (searchInput) {
        searchInput.value = "";
      }
    });
  }

  // 브레드크럼 category1 클릭
  const breadcrumbCategory1Button = document.querySelector("[data-breadcrumb='category1']");
  if (breadcrumbCategory1Button) {
    breadcrumbCategory1Button.addEventListener("click", (e) => {
      const category1 = e.target.getAttribute("data-category1");
      stateManager.setState({
        selectedCategory1: category1,
        selectedCategory2: "",
        currentPage: 1,
        hasMore: true,
      });
    });
  }
}

async function fetchInitDatas() {
  const [productsResponse, categoriesResponse] = await Promise.all([getProducts(), getCategories()]);

  console.log("API 응답:", productsResponse, categoriesResponse);

  return {
    products: productsResponse.products,
    categories: categoriesResponse,
    total: productsResponse.pagination.total,
  };
}

async function main() {
  // 라우터 설정
  window.addEventListener("popstate", router);
  // 초기 라우트 처리
  router();

  // 초기 데이터 로드 시작
  stateManager.setState({
    loading: true,
    categoriesLoading: true,
  });

  try {
    const { products, categories, total } = await fetchInitDatas();

    stateManager.setState({
      products,
      categories,
      total,
      loading: false,
      categoriesLoading: false,
    });

    console.log("데이터 로드 완료:", products, categories, total);
  } catch (error) {
    console.error("초기 데이터 로딩 실패:", error);
    stateManager.setState({
      loading: false,
      categoriesLoading: false,
    });
  }
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
