import { getLimitFromURL } from "./router.js";

// 애플리케이션 상태
export const state = {
  productList: [],
  total: 0,
  limit: getLimitFromURL(),
  currentPage: 1,
  loading: false,
};

// 상태 업데이트 함수들
export function setProductList(products) {
  state.productList = products;
}

export function setTotal(total) {
  state.total = total;
}

export function setLimit(limit) {
  state.limit = limit;
}

export function setCurrentPage(page) {
  state.currentPage = page;
}

export function setLoading(loading) {
  state.loading = loading;
}

export function resetState() {
  state.productList = [];
  state.currentPage = 1;
  state.loading = false;
}
