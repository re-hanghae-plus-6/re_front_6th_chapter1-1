import { createStore } from "../../../store/create-store";
import type { ProductDetail } from "../../../api/productApi";
import { QueryDataType } from "../../../query/query-data-type";

export const productDetailStore = createStore<QueryDataType<ProductDetail | null>>({
  isLoading: false,
  data: null,
  error: null,
});
