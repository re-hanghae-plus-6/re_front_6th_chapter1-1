import { CategoryMap } from "../../../api/productApi";
import { createStore } from "../../../store/create-store";

export interface CategoryStoreState {
  isLoading: boolean;
  data: CategoryMap;
}

export const categoryStore = createStore<CategoryStoreState>({
  isLoading: false,
  data: {},
});
