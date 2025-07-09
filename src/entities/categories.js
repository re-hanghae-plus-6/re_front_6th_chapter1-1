import { getCategories } from "../api/productApi";
import { categoriesStore } from "../store";

export const fetchCategories = async () => {
  categoriesStore.setState({ isLoading: true, error: null });
  try {
    const categories = await getCategories();
    categoriesStore.setState({ categories, isLoading: false });
  } catch (error) {
    console.error(error);
    categoriesStore.setState({ error: "카테고리 조회 에러", isLoading: false });
  }
};
