import { Store } from "./store";

const initialFilterState = {
  filters: {
    page: 1,
    limit: 20,
    search: "",
    category1: "",
    category2: "",
    sort: "price_asc",
  },
  categories: [],
  loadingCategories: true,
};

export const productFilterStore = new Store(initialFilterState);
export const productFilterState = productFilterStore.state;
