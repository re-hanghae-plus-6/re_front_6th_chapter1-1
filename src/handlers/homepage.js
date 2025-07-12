import { getProducts, getCategories } from "../api/productApi.js";
import { updateUrlParams } from "./url.js";

export const createHomePageHandlers = (state, updateState, render) => ({
  // 페이지당 상품 수 변경
  async handleLimitChange(newLimit) {
    updateState({
      productCount: newLimit,
      page: 1,
      loading: true,
    });

    // URL 업데이트
    updateUrlParams({
      limit: newLimit,
      page: 1,
      sort: state.sort,
      search: state.search,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
    });

    render();

    // 새로운 limit으로 API 재호출
    const {
      products,
      pagination: { total },
    } = await getProducts({
      limit: newLimit,
      sort: state.sort,
      search: state.search,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
      page: 1,
    });

    // 상태 업데이트
    updateState({
      products: products,
      total: total,
      loading: false,
    });

    render();
  },

  // 정렬 변경
  async handleSortChange(newSort) {
    updateState({
      sort: newSort,
      page: 1,
      loading: true,
    });

    // URL 업데이트
    updateUrlParams({
      limit: state.productCount,
      page: 1,
      sort: newSort,
      search: state.search,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
    });

    const {
      products,
      pagination: { total },
    } = await getProducts({
      limit: state.productCount,
      sort: newSort,
      search: state.search,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
      page: 1,
    });

    // 상태 업데이트
    updateState({
      products: products,
      total: total,
      loading: false,
    });

    render();
  },

  // 검색
  async handleSearch(searchValue) {
    updateState({
      search: searchValue,
      page: 1,
      loading: true,
    });

    // URL 업데이트
    updateUrlParams({
      limit: state.productCount,
      page: 1,
      sort: state.sort,
      search: searchValue,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
    });

    const { products, pagination } = await getProducts({
      limit: state.productCount,
      sort: state.sort,
      search: searchValue,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
      page: 1,
    });

    updateState({
      products: products,
      page: pagination.page,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      loading: false,
      total: pagination.total,
    });

    render();
  },

  // 카테고리 1 필터
  async handleCategory1Filter(category1) {
    updateState({
      selectedCategory1: category1,
      selectedCategory2: null,
      page: 1,
      loading: true,
    });

    // URL 업데이트
    updateUrlParams({
      limit: state.productCount,
      page: 1,
      sort: state.sort,
      search: state.search,
      category1: category1,
      category2: null,
    });

    // 전체 카테고리와 상품 정보를 다시 가져오기
    const [{ products, pagination }, categories] = await Promise.all([
      getProducts({
        limit: state.productCount,
        sort: state.sort,
        search: state.search,
        category1: category1,
        category2: null,
        page: 1,
      }),
      getCategories(),
    ]);

    // 해당 카테고리의 서브카테고리 목록으로 설정
    const categoryDetail = categories[category1];

    updateState({
      products: products,
      page: pagination.page,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      loading: false,
      total: pagination.total,
      categories: categoryDetail,
    });

    render();
  },

  // 카테고리 2 필터
  async handleCategory2Filter(category2) {
    updateState({
      selectedCategory2: category2,
      page: 1,
      loading: true,
    });

    // URL 업데이트
    updateUrlParams({
      limit: state.productCount,
      page: 1,
      sort: state.sort,
      search: state.search,
      category1: state.selectedCategory1,
      category2: category2,
    });

    const {
      products,
      pagination: { total, page, hasNext, hasPrev },
    } = await getProducts({
      limit: state.productCount,
      sort: state.sort,
      search: state.search,
      category1: state.selectedCategory1,
      category2: category2,
      page: 1,
    });

    updateState({
      products: products,
      total: total,
      page: page,
      hasNext: hasNext,
      hasPrev: hasPrev,
      loading: false,
    });

    render();
  },

  // 카테고리 리셋
  async handleCategoryReset() {
    updateState({
      selectedCategory1: null,
      selectedCategory2: null,
      page: 1,
      loading: true,
    });

    // URL 업데이트
    updateUrlParams({
      limit: state.productCount,
      page: 1,
      sort: state.sort,
      search: state.search,
      category1: null,
      category2: null,
    });

    // 전체 카테고리 다시 로드
    const [{ products, pagination }, categories] = await Promise.all([
      getProducts({
        limit: state.productCount,
        sort: state.sort,
        search: state.search,
        page: 1,
      }),
      getCategories(),
    ]);

    updateState({
      products: products,
      categories: categories,
      page: pagination.page,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      total: pagination.total,
      loading: false,
    });

    render();
  },

  // 브레드크럼 카테고리 1 클릭
  async handleBreadcrumbCategory1Click(category1) {
    // category2는 제거하고 category1만 유지
    updateState({
      selectedCategory1: category1,
      selectedCategory2: null,
      page: 1,
      loading: true,
    });

    // URL 업데이트
    updateUrlParams({
      limit: state.productCount,
      page: 1,
      sort: state.sort,
      search: state.search,
      category1: category1,
      category2: null,
    });

    // 전체 카테고리와 상품 정보를 다시 가져오기
    const [{ products, pagination }, categories] = await Promise.all([
      getProducts({
        limit: state.productCount,
        sort: state.sort,
        search: state.search,
        category1: category1,
        page: 1,
      }),
      getCategories(),
    ]);

    // 해당 카테고리의 서브카테고리 목록으로 설정
    const categoryDetail = categories[category1];

    updateState({
      products: products,
      page: pagination.page,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      loading: false,
      total: pagination.total,
      categories: categoryDetail,
    });

    render();
  },

  // URL에서 검색 처리
  async handleSearchFromUrl(searchTerm) {
    updateState({
      search: searchTerm,
      page: 1,
      loading: true,
    });

    render();

    const { products, pagination } = await getProducts({
      limit: state.productCount,
      sort: state.sort,
      search: searchTerm,
      page: 1,
    });

    updateState({
      products: products,
      page: pagination.page,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      loading: false,
      total: pagination.total,
    });

    render();
  },

  // 무한 스크롤
  async loadMoreProducts() {
    if (state.loading || !state.hasNext) return;

    updateState({ loading: true });
    render();

    // 1. 새 데이터 가져오기
    const newData = await getProducts({
      limit: state.productCount,
      page: state.page + 1,
      sort: state.sort,
      search: state.search,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
    });

    // 2. 기존 배열에 추가 및 상태 변경
    updateState({
      products: [...state.products, ...newData.products],
      hasNext: newData.pagination.hasNext,
      hasPrev: newData.pagination.hasPrev,
      page: newData.pagination.page,
      loading: false,
    });

    // 3. URL 업데이트
    updateUrlParams({
      limit: state.productCount,
      page: newData.pagination.page,
      sort: state.sort,
      search: state.search,
      category1: state.selectedCategory1,
      category2: state.selectedCategory2,
    });

    // 4. 다시 그리기
    render();
  },
});
