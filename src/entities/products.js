import { getProducts } from "../api/productApi";
import { productsStore } from "../store";

export const fetchProducts = async () => {
  productsStore.setState({ isLoading: true, error: null });
  try {
    const products = await getProducts();
    productsStore.setState({ ...products, isLoading: false });
  } catch (error) {
    console.error(error);
    productsStore.setState({ error: "상품목록 조회 에러", isLoading: false });
  }
};
