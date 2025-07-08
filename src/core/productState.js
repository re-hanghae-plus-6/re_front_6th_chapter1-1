import { Store } from "./store.js";

const initialState = {
  products: [],
  total: 0,
  categories: [],
  loadingCategories: true,
  filters: {
    search: "",
    category1: "",
    category2: "",
    limit: 20,
    sort: "price_asc",
  },
};

/* 범용 Store 이용 */
export const productStore = new Store(JSON.parse(JSON.stringify(initialState)));

/* 테스트·기존 코드 호환: Proxy 노출 */
export const productState = new Proxy(
  {},
  {
    get(_, prop) {
      return productStore.state[prop];
    },
    set(_, prop, value) {
      productStore.setState({ [prop]: value });
      return true;
    },
  },
);

/* reset 헬퍼 (테스트 등에서 사용) */
export const resetProductState = () => productStore.reset(initialState);
