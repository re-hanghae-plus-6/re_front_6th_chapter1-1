import { getProducts } from "../api/productApi";
import { updateQueryParams } from "./queryStringHandler.js";
import productListStore from "../core/productListStore.js";

// 검색 실행 함수
export const performSearch = async (searchTerm, renderCallback) => {
  try {
    // 검색 상태로 변경
    productListStore.setState({
      page: 1,
      search: searchTerm,
      hasMore: true,
      products: [],
    });

    // URL 쿼리 파라미터 업데이트
    updateQueryParams({ search: searchTerm, page: 1 });

    const state = productListStore.getState();

    // 검색 결과 가져오기
    const { products, pagination } = await getProducts({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      search: searchTerm,
      category1: state.category1,
      category2: state.category2,
    });

    productListStore.setState({
      products,
      hasMore: products.length === state.limit,
      totalProducts: pagination.total,
    });

    // 화면 다시 렌더링
    if (renderCallback) {
      renderCallback();
    }
  } catch (error) {
    console.error("검색 실패:", error);
  }
};

// 검색어 초기화 함수
export const clearSearch = async (renderCallback) => {
  productListStore.resetSearch();

  try {
    const state = productListStore.getState();
    const { products, pagination } = await getProducts({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      category1: state.category1,
      category2: state.category2,
    });

    productListStore.setState({
      products,
      hasMore: products.length === state.limit,
      totalProducts: pagination.total,
    });

    if (renderCallback) {
      renderCallback();
    }
  } catch (error) {
    console.error("검색 초기화 실패:", error);
  }
};
