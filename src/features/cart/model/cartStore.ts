import { createPersistStore } from "../../../store/create-store";
import { Product } from "../../../api/productApi";
type CartType = {
  productList: Product[];
  selectedProductIds: string[];
};

export const cartStore = createPersistStore<CartType>("cart", {
  productList: [],
  selectedProductIds: [],
});
