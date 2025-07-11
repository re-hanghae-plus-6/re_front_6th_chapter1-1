import FilterSection from "../components/filter/FilterSection.js";
import ProductGrid from "../components/product/ProductGrid.js";
import MainLayout from "../components/layout/MainLayout.js";
import { getCartCount, updateCartBadge } from "../core/cart.js";
import { getProducts, getCategories } from "../api/productApi.js";
import createStore from "../core/store.js";
import { getQueryParams, updateQueryParams } from "../core/router.js";
import { stateToQueryParams, queryParamsToState } from "../utils/urlStateUtils.js";
import { getAppPath } from "../core/router.js";

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
};

let store = null;
let prevState = { ...initialState };

export default function HomePage({ cartCount = 0 }) {
  if (!store) {
    store = createStore(initialState);

    // 상태 변경 시 자동 렌더링
    store.subscribe(() => {
      const state = store.getState();
      if (shouldRefetchProducts(state, prevState)) {
        syncUrlWithState(state);
        fetchProducts();
      }
      // 렌더링 (라우터에서 직접 호출 시 중복 렌더 방지)
      if (getAppPath() === "/") {
        render(state, cartCount);
      }
      prevState = { ...state };
    });

    // popstate(뒤로/앞으로) 대응
    window.addEventListener("popstate", handlePopState);

    // 최초 데이터 로딩
    initialize();
  }

  // HTML과 cleanup 함수를 함께 반환
  return {
    html: render(store.getState(), cartCount),
    cleanup,
  };
}

function cleanup() {
  if (store) {
    // popstate 이벤트 리스너 정리
    window.removeEventListener("popstate", handlePopState);

    // 스토어 정리
    store.unsubscribeAll();
    store = null;
    prevState = { ...initialState };

    // 스크롤 이벤트 리스너 정리
    if (attachEventListeners.onScroll) {
      window.removeEventListener("scroll", attachEventListeners.onScroll);
      attachEventListeners.onScroll = null;
    }
  }
}

// 렌더링 함수
function render(state, cartCount) {
  // cartCount 매 렌더링마다 로컬스토리지와 동기화하여 최신 값 사용
  cartCount = getCartCount();
  const $root = document.getElementById("root");
  if (!$root) return "";

  $root.innerHTML = MainLayout({
    children: `
      ${FilterSection({
        searchValue: state.searchValue,
        categories: state.categories,
        selectedCategory1: state.selectedCategory1,
        selectedCategory2: state.selectedCategory2,
        selectedSort: state.selectedSort,
        selectedLimit: state.selectedLimit,
        isLoading: state.categoriesLoading,
      })}
      ${ProductGrid({
        products: state.products,
        totalCount: state.total,
        isLoading: state.loading,
        hasMore: state.hasMore,
      })}
    `,
    cartCount,
    showBackButton: false,
    title: "쇼핑몰",
  });

  // 헤더가 새로 렌더링된 뒤 뱃지를 DOM에 적용
  updateCartBadge();

  attachEventListeners();
}

// 이전 상태와 현재 상태 변경을 감지
function shouldRefetchProducts(current, prev) {
  return (
    (current.searchValue !== prev.searchValue ||
      current.selectedCategory1 !== prev.selectedCategory1 ||
      current.selectedCategory2 !== prev.selectedCategory2 ||
      current.selectedSort !== prev.selectedSort ||
      current.selectedLimit !== prev.selectedLimit) &&
    !current.loading
  );
}

// URL 쿼리스트링 동기화
function syncUrlWithState(state) {
  // 홈 페이지가 아닌 경우(URL 이동 후 HomePage의 비동기 로직이 늦게 도착한 경우)에는 URL을 건드리지 않는다.
  if (getAppPath() !== "/") return;
  const queryParams = stateToQueryParams(state);
  updateQueryParams(queryParams, { replace: true });
}

// 최초 데이터 로딩
async function initialize() {
  const urlState = queryParamsToState(getQueryParams());
  store.setState({
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
    const hasMore = urlState.currentPage * parseInt(urlState.selectedLimit) < productsResponse.pagination.total;
    store.setState({
      products: productsResponse.products,
      categories: categoriesResponse,
      total: productsResponse.pagination.total,
      loading: false,
      categoriesLoading: false,
      hasMore,
    });
  } catch (e) {
    console.error("홈 데이터 로딩 실패:", e);
    store.setState({
      loading: false,
      categoriesLoading: false,
    });
  }
}

// 상품 목록 재조회
async function fetchProducts() {
  const state = store.getState();
  const storeRef = store; // 현재 스토어 캡처
  storeRef.setState({ loading: true });
  try {
    const response = await getProducts({
      page: state.currentPage,
      limit: parseInt(state.selectedLimit),
      search: state.searchValue,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
      sort: state.selectedSort,
    });
    const hasMore = state.currentPage * parseInt(state.selectedLimit) < response.pagination.total;
    storeRef.setState({
      products: response.products,
      total: response.pagination.total,
      loading: false,
      hasMore,
    });

    // URL 쿼리스트링 동기화 (current 페이지 반영)
    syncUrlWithState(storeRef.getState());
  } catch (e) {
    console.error("상품 데이터 로딩 실패:", e);
    if (store === storeRef) storeRef.setState({ loading: false });
  }
}

// popstate 이벤트 핸들러..
function handlePopState() {
  if (getAppPath() === "/") {
    const urlState = queryParamsToState(getQueryParams());
    store.setState({ ...urlState, loading: false });

    const searchInput = document.querySelector("#search-input");
    if (searchInput) searchInput.value = urlState.searchValue;
  }
}

// 추가 상품 로드 (무한 스크롤)
async function loadMoreProducts() {
  const state = store.getState();
  const storeRef = store;
  if (state.loading || !state.hasMore) return;

  const nextPage = state.currentPage + 1;
  storeRef.setState({ loading: true });

  try {
    const response = await getProducts({
      page: nextPage,
      limit: parseInt(state.selectedLimit),
      search: state.searchValue,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
      sort: state.selectedSort,
    });

    const newProducts = [...state.products, ...response.products];
    const hasMore = nextPage * parseInt(state.selectedLimit) < response.pagination.total;

    storeRef.setState({
      products: newProducts,
      total: response.pagination.total,
      currentPage: nextPage,
      loading: false,
      hasMore,
    });

    // URL 쿼리스트링 동기화 (current 페이지 반영)
    syncUrlWithState(storeRef.getState(), { replace: true });
  } catch (e) {
    console.error("추가 상품 로딩 실패:", e);
    if (store === storeRef) storeRef.setState({ loading: false });
  }
}

// 이벤트 리스너 등록
function attachEventListeners() {
  // 검색
  const searchInput = document.querySelector("#search-input");
  if (searchInput) {
    searchInput.value = store.getState().searchValue;

    // onKeydown 이벤트로 검색 입력 처리
    searchInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        store.setState({ searchValue: e.target.value, currentPage: 1 });
      }
    };

    // onKeyup 이벤트로 검색 입력 처리
    searchInput.onkeyup = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        store.setState({ searchValue: e.target.value, currentPage: 1 });
      }
    };

    // onChange 이벤트로 검색 입력 처리
    searchInput.onchange = (e) => {
      store.setState({ searchValue: e.target.value, currentPage: 1 });
    };
  }

  // 페이지당 상품 수
  const limitSelect = document.querySelector("#limit-select");
  if (limitSelect) {
    limitSelect.onchange = (e) => {
      store.setState({ selectedLimit: e.target.value, currentPage: 1 });
    };
  }

  // 정렬
  const sortSelect = document.querySelector("#sort-select");
  if (sortSelect) {
    sortSelect.onchange = (e) => {
      store.setState({ selectedSort: e.target.value, currentPage: 1 });
    };
  }

  // 카테고리1
  document.querySelectorAll("[data-category1]:not([data-category2])").forEach((btn) => {
    btn.onclick = (e) => {
      store.setState({
        selectedCategory1: e.target.getAttribute("data-category1"),
        selectedCategory2: "",
        currentPage: 1,
      });
    };
  });

  // 카테고리2
  document.querySelectorAll("[data-category2]").forEach((btn) => {
    btn.onclick = (e) => {
      store.setState({
        selectedCategory1: e.target.getAttribute("data-category1"),
        selectedCategory2: e.target.getAttribute("data-category2"),
        currentPage: 1,
      });
    };
  });

  // 브레드크럼 리셋
  const resetBtn = document.querySelector("[data-breadcrumb='reset']");
  if (resetBtn) {
    resetBtn.onclick = () => {
      window.navigateTo("/");
      store.setState({
        selectedCategory1: "",
        selectedCategory2: "",
        searchValue: "",
        currentPage: 1,
      });
      if (searchInput) searchInput.value = "";
    };
  }

  // 브레드크럼 category1
  const bcCategory1Btn = document.querySelector("[data-breadcrumb='category1']");
  if (bcCategory1Btn) {
    bcCategory1Btn.onclick = (e) => {
      store.setState({
        selectedCategory1: e.target.getAttribute("data-category1"),
        selectedCategory2: "",
        currentPage: 1,
      });
    };
  }

  // 상품 상세 이동.
  document.querySelectorAll("[data-product-link]").forEach((link) => {
    link.onclick = (e) => {
      const productId = e.currentTarget.getAttribute("data-product-link");
      window.navigateTo(`/product/${productId}`);
    };
  });

  // 무한 스크롤
  const onScroll = () => {
    const { loading, hasMore } = store.getState();
    if (loading || !hasMore) return;

    const THRESHOLD = 150;
    const scrolledHeight = window.innerHeight + window.scrollY;
    const documentHeight = document.body.offsetHeight;

    if (documentHeight - scrolledHeight <= THRESHOLD) {
      loadMoreProducts();
    }
  };

  window.addEventListener("scroll", onScroll);
  attachEventListeners.onScroll = onScroll;
}
