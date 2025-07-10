import { cartStore } from "./CartStore.js";
import { categoryStore } from "./CategoryStore.js";
import { productStore } from "./ProductStore.js";
import { urlStore } from "./URLStore.js";

// 전역 스토어 인스턴스 export
export { cartStore, categoryStore, productStore, urlStore };

// 스토어들 간의 연동 로직
class StoreManager {
  constructor() {
    this.setupSubscriptions();
  }

  // 스토어들 간의 구독 관계 설정
  setupSubscriptions() {
    let isInitializing = false;

    // 카테고리 변경 시 상품 목록 업데이트 및 URL 동기화
    categoryStore.subscribe(() => {
      if (isInitializing) return; // 초기화 중에는 구독 로직 실행하지 않음

      const categoryState = categoryStore.getSelectedCategories();
      const productState = productStore.getState();

      // URL 업데이트
      urlStore.updateURL({
        category1: categoryState.category1,
        category2: categoryState.category2,
        search: productState.search,
        sort: productState.sort,
        limit: productState.limit,
        page: 1, // 카테고리 변경 시 페이지 리셋
      });

      // 상품 목록 새로 로드
      productStore.resetPagination();
      productStore.loadProducts(categoryState);
    });

    // 상품 필터 변경 시 URL 동기화
    productStore.subscribe(() => {
      if (isInitializing) return; // 초기화 중에는 구독 로직 실행하지 않음

      const productState = productStore.getState();
      const categoryState = categoryStore.getSelectedCategories();

      // 로딩 중이 아닐 때만 URL 업데이트
      if (!productState.loading) {
        urlStore.updateURL({
          category1: categoryState.category1,
          category2: categoryState.category2,
          search: productState.search,
          sort: productState.sort,
          limit: productState.limit,
          page: productState.page,
        });
      }
    });

    // 초기화 상태 제어 함수들
    this.setInitializing = (value) => {
      isInitializing = value;
    };
  }

  // URL 파라미터에서 모든 스토어 상태 초기화
  initFromURL() {
    const params = urlStore.getQueryParams();

    categoryStore.setFromURLParams(params);
    productStore.setFromURLParams(params);
  }

  // 전체 상태 초기화
  resetAll() {
    categoryStore.resetSelection();
    productStore.reset();
    urlStore.resetURL();
  }

  // 상품 검색
  async searchProducts(searchTerm) {
    productStore.setSearch(searchTerm);
    const categoryState = categoryStore.getSelectedCategories();
    await productStore.loadProducts(categoryState);
  }

  // 정렬 변경
  async changeSorting(sortType) {
    productStore.setSort(sortType);
    const categoryState = categoryStore.getSelectedCategories();
    await productStore.loadProducts(categoryState);
  }

  // 페이지당 아이템 수 변경
  async changeLimit(newLimit) {
    productStore.setLimit(newLimit);
    const categoryState = categoryStore.getSelectedCategories();
    await productStore.loadProducts(categoryState);
  }

  // 카테고리 선택
  async selectCategory1(category1) {
    categoryStore.selectCategory1(category1);
  }

  async selectCategory2(category1, category2) {
    categoryStore.selectCategory2(category1, category2);
  }

  // 카테고리 초기화
  async resetCategory() {
    categoryStore.resetSelection();
  }

  // 무한 스크롤
  async loadMoreProducts() {
    const categoryState = categoryStore.getSelectedCategories();
    await productStore.loadMoreProducts(categoryState);
  }

  // 앱 초기화
  async initialize() {
    // 초기화 시작 - 구독 로직 비활성화
    this.setInitializing(true);

    try {
      // URL에서 상태 복원
      this.initFromURL();

      // 카테고리 로드
      await categoryStore.loadCategories();

      // 상품 로드
      const categoryState = categoryStore.getSelectedCategories();
      await productStore.loadProducts(categoryState);
    } finally {
      // 초기화 완료 - 구독 로직 활성화
      this.setInitializing(false);
    }
  }
}

// 전역 스토어 매니저 인스턴스
export const storeManager = new StoreManager();

// 편의 함수들
export function getAppState() {
  return {
    cart: cartStore.getCartItems(),
    cartCount: cartStore.getUniqueProductCount(),
    categories: categoryStore.getCategories(),
    categoriesLoading: categoryStore.getLoading(),
    selectedCategories: categoryStore.getSelectedCategories(),
    products: productStore.getState(),
  };
}
