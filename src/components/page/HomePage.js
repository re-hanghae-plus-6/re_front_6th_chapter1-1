import FilterSection from "../filter/FilterSection.js";
import ProductGrid from "../product/ProductGrid.js";
import MainLayout from "../layout/MainLayout.js";
import { getProducts, getCategories } from "../../api/productApi.js";
import createStateManager from "../../core/createStateManater.js";
import { getQueryParams, updateQueryParams } from "../../core/router.js";
import { stateToQueryParams, queryParamsToState } from "../../utils/urlStateUtils.js";

// 홈 전용 상태
const homePageState = {
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
};

let homeStateManager = null;
let previousHomeState = { ...homePageState };

// 홈페이지 초기화 및 렌더링
export default function HomePage({ cartCount = 0, onNavigate = null }) {
  // 상태 관리자 초기화 (한 번만)
  if (!homeStateManager) {
    homeStateManager = createStateManager(homePageState);

    // 상태 변경 시 DOM 업데이트 구독
    homeStateManager.subscribe(() => {
      const currentState = homeStateManager.getState();

      // 필터/검색 변경 감지
      const isFilterChange =
        currentState.searchValue !== previousHomeState.searchValue ||
        currentState.selectedCategory1 !== previousHomeState.selectedCategory1 ||
        currentState.selectedCategory2 !== previousHomeState.selectedCategory2 ||
        currentState.selectedSort !== previousHomeState.selectedSort ||
        currentState.selectedLimit !== previousHomeState.selectedLimit ||
        currentState.currentPage !== previousHomeState.currentPage;

      if (isFilterChange && !currentState.loading) {
        // URL 파라미터 업데이트
        const queryParams = stateToQueryParams(currentState);
        updateQueryParams(queryParams, { replace: true });

        fetchHomeProducts();
      }

      // DOM 업데이트 (홈페이지인 경우에만)
      if (window.location.pathname === "/") {
        updateHomePage(cartCount, onNavigate);
      }

      // 이전 상태 업데이트
      previousHomeState = { ...currentState };
    });

    // 브라우저 뒤로가기/앞으로가기 이벤트 처리
    window.addEventListener("popstate", handlePopState);

    // 초기 데이터 로드
    initializeHomePage();
  }

  // 현재 상태로 렌더링
  const state = homeStateManager.getState();
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
  } = state;

  // 렌더링 완료 후 이벤트 리스너 연결
  setTimeout(() => {
    attachHomeEventListeners(onNavigate);
  }, 0);

  return MainLayout({
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
      })}
    `,
    cartCount,
    showBackButton: false,
    title: "쇼핑몰",
  });
}

// 홈페이지 DOM 업데이트 함수
function updateHomePage(cartCount, onNavigate) {
  const $root = document.getElementById("root");
  if ($root) {
    const state = homeStateManager.getState();
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
    } = state;

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
        })}
      `,
      cartCount,
      showBackButton: false,
      title: "쇼핑몰",
    });

    // 렌더링 완료 후 이벤트 리스너 연결
    setTimeout(() => {
      attachHomeEventListeners(onNavigate);
    }, 0);
  }
}

// 초기 데이터 로드
async function initializeHomePage() {
  // URL 파라미터에서 상태 읽어오기
  const queryParams = getQueryParams();
  const urlState = queryParamsToState(queryParams);

  homeStateManager.setState({
    ...urlState,
    loading: true,
    categoriesLoading: true,
  });

  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      getProducts({
        page: urlState.currentPage,
        limit: parseInt(urlState.selectedLimit),
        search: urlState.searchValue,
        category1: urlState.selectedCategory1,
        category2: urlState.selectedCategory2,
        sort: urlState.selectedSort,
      }),
      getCategories(),
    ]);

    homeStateManager.setState({
      products: productsResponse.products,
      categories: categoriesResponse,
      total: productsResponse.pagination.total,
      loading: false,
      categoriesLoading: false,
    });
  } catch (error) {
    console.error("홈페이지 초기 데이터 로딩 실패:", error);
    homeStateManager.setState({
      loading: false,
      categoriesLoading: false,
    });
  }
}

// 상품 데이터 가져오기
async function fetchHomeProducts() {
  const state = homeStateManager.getState();
  const { searchValue, selectedCategory1, selectedCategory2, selectedSort, selectedLimit, currentPage } = state;

  homeStateManager.setState({ loading: true });

  try {
    const response = await getProducts({
      page: currentPage,
      limit: parseInt(selectedLimit),
      search: searchValue,
      category1: selectedCategory1,
      category2: selectedCategory2,
      sort: selectedSort,
    });

    homeStateManager.setState({
      products: response.products,
      total: response.pagination.total,
      loading: false,
    });
  } catch (error) {
    console.error("상품 데이터 로딩 실패:", error);
    homeStateManager.setState({
      loading: false,
    });
  }
}

// 브라우저 뒤로가기/앞으로가기 이벤트 처리
function handlePopState() {
  if (window.location.pathname === "/") {
    const queryParams = getQueryParams();
    const urlState = queryParamsToState(queryParams);

    homeStateManager.setState({
      ...urlState,
      loading: false,
    });

    // 검색 입력 필드 값 업데이트
    const searchInput = document.querySelector("#search-input");
    if (searchInput) {
      searchInput.value = urlState.searchValue;
    }
  }
}

// 홈페이지 이벤트 리스너 등록
function attachHomeEventListeners(onNavigate) {
  // 검색 입력 필드 초기값 설정
  const searchInput = document.querySelector("#search-input");
  if (searchInput) {
    const currentState = homeStateManager.getState();
    searchInput.value = currentState.searchValue;

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        homeStateManager.setState({
          searchValue: e.target.value,
          currentPage: 1,
        });
      }
    });
  }

  // 페이지당 상품 수 변경
  const limitSelect = document.querySelector("#limit-select");
  if (limitSelect) {
    limitSelect.addEventListener("change", (e) => {
      homeStateManager.setState({
        selectedLimit: e.target.value,
        currentPage: 1,
      });
    });
  }

  // 정렬 변경
  const sortSelect = document.querySelector("#sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      homeStateManager.setState({
        selectedSort: e.target.value,
        currentPage: 1,
      });
    });
  }

  // 카테고리 필터
  const category1Buttons = document.querySelectorAll("[data-category1]:not([data-category2])");
  category1Buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const category1 = e.target.getAttribute("data-category1");
      homeStateManager.setState({
        selectedCategory1: category1,
        selectedCategory2: "",
        currentPage: 1,
      });
    });
  });

  // 2차 카테고리 필터
  const category2Buttons = document.querySelectorAll("[data-category2]");
  category2Buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const category1 = e.target.getAttribute("data-category1");
      const category2 = e.target.getAttribute("data-category2");
      homeStateManager.setState({
        selectedCategory1: category1,
        selectedCategory2: category2,
        currentPage: 1,
      });
    });
  });

  // 브레드크럼 리셋
  const resetButton = document.querySelector("[data-breadcrumb='reset']");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      homeStateManager.setState({
        selectedCategory1: "",
        selectedCategory2: "",
        searchValue: "",
        currentPage: 1,
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
      homeStateManager.setState({
        selectedCategory1: category1,
        selectedCategory2: "",
        currentPage: 1,
      });
    });
  }

  // 상품 클릭 이벤트 (상품 상세 페이지로 이동)
  const productLinks = document.querySelectorAll("[data-product-link]");
  productLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("data-product-link");
      if (productId && onNavigate) {
        onNavigate(`/product/${productId}`);
      }
    });
  });
}
