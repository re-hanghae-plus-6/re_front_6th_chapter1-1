import { Store } from "./store.js";

const initialDetailState = {
  product: null,
  related: [],
  loading: true,
  qty: 1,
};

export const productDetailStore = new Store(initialDetailState);
export const productDetailState = productDetailStore.state;
