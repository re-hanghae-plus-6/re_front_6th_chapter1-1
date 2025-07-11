import { getProducts, getCategories } from "../api/productApi";
import { productListLoaded } from "../components/productListLoaded";
import { setupCartEventListeners, updateCartCount, resetCartEventListeners } from "../utils/cartHandler.js";
import { updateQueryParams, syncStateFromQuery } from "../utils/queryStringHandler.js";
import {
  setupGlobalEventHandlers,
  setupSearchEventListeners,
} from "../utils/eventHandlers/setupGlobalEventHandlers.js";
import { renderProductListLoading } from "../utils/loadingHandler.js";

const root = document.getElementById("root");

let state = {
  page: 1,
  limit: 20,
  sort: "price_asc",
  search: "",
  category1: "",
  category2: "",
  isLoading: false,
  hasMore: true,
  products: [],
  categories: {},
  selectedCategories: {},
  totalProducts: 0,
};

// URL 쿼리 파라미터로 초기 state 동기화
state = syncStateFromQuery(state);

const renderContent = () => {
  root.innerHTML = productListLoaded(
    state.products,
    state.limit,
    state.search,
    state.categories,
    state.selectedCategories,
    state.totalProducts,
  );

  // 공통 이벤트 핸들러 설정
  setupGlobalEventHandlers(state, renderInitialContent, loadMoreProducts);

  // 검색 이벤트 리스너 설정
  setupSearchEventListeners(state, renderContent);

  // 장바구니 이벤트 리스너 설정
  setupCartEventListeners();
  updateCartCount();
};

// 테스트 환경에서 state 초기화 함수
const resetState = () => {
  if (import.meta.env.TEST) {
    state = {
      page: 1,
      limit: 20,
      sort: "price_asc",
      search: "",
      category1: "",
      category2: "",
      isLoading: false,
      hasMore: true,
      products: [],
      categories: {},
      selectedCategories: {},
      totalProducts: 0,
    };
    // 테스트 환경에서 장바구니 이벤트 리스너도 초기화
    resetCartEventListeners();
  }
};

const loadCategories = async () => {
  try {
    const categories = await getCategories();
    state.categories = categories;
  } catch (err) {
    console.error("카테고리 로딩 실패:", err);
    state.categories = {};
  }
};

const renderInitialContent = async () => {
  renderProductListLoading(root);

  try {
    // 카테고리 데이터 로드
    await loadCategories();

    const { products, pagination } = await getProducts({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      search: state.search,
      category1: state.category1,
      category2: state.category2,
    });

    state.products = products;
    state.page = 1;
    state.hasMore = products.length === state.limit;
    state.totalProducts = pagination.total;

    renderContent();
  } catch (err) {
    console.error("초기 상품 목록 로딩 실패:", err);
    root.innerHTML = `<div class="p-4 text-red-600">상품을 불러오지 못했습니다.</div>`;
  }
};

const loadMoreProducts = async () => {
  if (state.isLoading || !state.hasMore) return;
  state.isLoading = true;
  state.page += 1;

  // 페이지 변경 시 쿼리 스트링 업데이트 (무한 스크롤에서는 히스토리 추가하지 않음)
  updateQueryParams({ page: state.page }, false);

  renderProductListLoading(root);
  try {
    const { products: nextProducts, pagination } = await getProducts({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      search: state.search,
      category1: state.category1,
      category2: state.category2,
    });

    if (!nextProducts || nextProducts.length === 0) {
      state.hasMore = false;
      return;
    }

    state.products = [...state.products, ...nextProducts];
    state.totalProducts = pagination.total;
    renderContent();
  } catch (err) {
    console.error("다음 상품 로딩 실패:", err);
  } finally {
    state.isLoading = false;
  }
};

export const productListPage = async () => {
  // 테스트 환경에서 state 초기화
  resetState();

  await renderInitialContent();
};
