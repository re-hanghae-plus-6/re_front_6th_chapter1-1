export const state = {
  products: [],
  pagination: {
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    total: 0,
  },
  filters: {
    search: "",
    sort: "price_asc",
    category1: "",
    category2: "",
  },
  cart: [],
  loading: true,
  categories: null,
  productInfiniteLoading: false,
};

export const setState = (partialState) => {
  Object.assign(state, partialState);
  notify(); // 상태 바뀔 때마다 전체 구독자 알림
};

const listeners = new Set();

export function subscribe(callback) {
  listeners.add(callback);
  callback();
  return () => listeners.delete(callback);
}
export function notify() {
  for (const callback of listeners) callback();
}
