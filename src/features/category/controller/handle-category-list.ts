import { getCategories } from "../../../api/productApi";
import { categoryStore } from "../model/category-store";

export const handleCategoryList = async () => {
  categoryStore.setValue((prev) => ({
    ...prev,
    isLoading: true,
  }));

  const response = await getCategories();

  categoryStore.setValue((prev) => ({
    isLoading: false,
    data: response,
  }));
};
