import { getProducts, getCategories } from "../api/productApi.js";
import { getURLParams } from "../utils/urlParams.js";
import { actions } from "../stores/actions.js";

export const createProductService = (store) => {
  /** 상품 목록 로드 */
  const loadProducts = async () => {
    const { dispatch } = store;

    try {
      dispatch(actions.setLoading(true));

      const params = getURLParams();
      const { products, pagination } = await getProducts(params);

      dispatch(actions.setProducts(products, pagination.total));
    } catch (error) {
      console.error("상품 로딩 실패:", error);
      dispatch(actions.setLoading(false));
    }
  };

  /** 카테고리 로드 */
  const loadCategories = async () => {
    const { dispatch } = store;

    try {
      const categories = await getCategories();
      dispatch(actions.setCategories(categories));
    } catch (error) {
      console.error("카테고리 로딩 실패:", error);
    }
  };

  return { loadProducts, loadCategories };
};
