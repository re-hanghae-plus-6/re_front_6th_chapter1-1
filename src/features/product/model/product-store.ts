import { Product, ProductListResponse } from "../../../api/productApi";
import { QueryDataType } from "../../../query/query-data-type";
import { createStore } from "../../../store/create-store";

export const productStore = createStore<QueryDataType<ProductListResponse[]>>({
  isLoading: false,
  data: [],
  error: null,
  page: 1,
  limit: 20,
});
