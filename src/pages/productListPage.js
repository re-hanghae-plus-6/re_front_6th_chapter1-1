import { getProducts, getCategories } from "../api/productApi";
import { productListLoaded } from "../components/productListLoaded";
import { updateCartCount, resetCartEventListeners } from "../utils/cartHandler.js";
import { setupGlobalEventHandlers } from "../utils/eventHandlers/setupGlobalEventHandlers.js";
import { renderProductListLoading } from "../utils/loadingHandler.js";
import productListStore from "../core/productListStore.js";
import { subscribeToState } from "../core/stateUtils.js";

const root = document.getElementById("root");

// 상태 변경 시 렌더링 함수
const renderContent = (state) => {
  root.innerHTML = productListLoaded(
    state.products,
    state.limit,
    state.search,
    state.categories,
    state.selectedCategories,
    state.totalProducts,
  );

  // 공통 이벤트 핸들러 설정
  setupGlobalEventHandlers(renderInitialContent, loadMoreProducts);

  updateCartCount();
};

// 상태 변경 구독 설정
subscribeToState(renderContent);

// 테스트 환경에서 상태 초기화 함수
const resetState = () => {
  if (import.meta.env.TEST) {
    productListStore.reset();
    // 테스트 환경에서 장바구니 이벤트 리스너도 초기화
    resetCartEventListeners();
  }
};

const loadCategories = async () => {
  try {
    const categories = await getCategories();
    productListStore.setCategories(categories);
  } catch (err) {
    console.error("카테고리 로딩 실패:", err);
    productListStore.setCategories({});
  }
};

const renderInitialContent = async () => {
  renderProductListLoading(root);

  try {
    // 카테고리 데이터 로드
    await loadCategories();

    const state = productListStore.getState();
    const { products, pagination } = await getProducts({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      search: state.search,
      category1: state.category1,
      category2: state.category2,
    });

    productListStore.setState({
      products,
      page: 1,
      hasMore: products.length === state.limit,
      totalProducts: pagination.total,
    });
  } catch (err) {
    console.error("초기 상품 목록 로딩 실패:", err);
    root.innerHTML = `<div class="p-4 text-red-600">상품을 불러오지 못했습니다.</div>`;
  }
};

const loadMoreProducts = async () => {
  const state = productListStore.getState();

  if (state.isLoading || !state.hasMore) return;

  productListStore.setLoading(true);
  productListStore.setPage(state.page + 1);

  renderProductListLoading(root);

  try {
    const { products: nextProducts, pagination } = await getProducts({
      page: state.page + 1,
      limit: state.limit,
      sort: state.sort,
      search: state.search,
      category1: state.category1,
      category2: state.category2,
    });

    if (!nextProducts || nextProducts.length === 0) {
      productListStore.setHasMore(false);
      return;
    }

    productListStore.addProducts(nextProducts);
    productListStore.setTotalProducts(pagination.total);
  } catch (err) {
    console.error("다음 상품 로딩 실패:", err);
  } finally {
    productListStore.setLoading(false);
  }
};

export const productListPage = async () => {
  // 테스트 환경에서 상태 초기화
  resetState();

  await renderInitialContent();
};
