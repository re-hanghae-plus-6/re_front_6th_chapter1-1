import { Store } from "./store";

const initialProductState = {
  products: [],
  total: 0,
};

export const productStore = new Store(initialProductState);
export const productState = productStore.state;
