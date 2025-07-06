import { createState } from "../../../utils/createState.js";

export const productStore = createState({
  products: [],
  categories: [],
  loading: false,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
});
