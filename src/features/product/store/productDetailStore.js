import { createState } from "../../../utils/createState.js";

export const productDetailStore = createState({
  product: null,
  isLoading: true,
  error: null,
  quantity: 1,
  relatedProducts: [],
});
