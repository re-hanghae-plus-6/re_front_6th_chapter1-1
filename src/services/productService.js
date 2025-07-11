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
      const { products, pagination } = await getProducts({ ...params, page: 1 });

      dispatch(actions.setProducts(products, pagination.total));
    } catch (error) {
      console.error("상품 로딩 실패:", error);
      dispatch(actions.setLoading(false));
    }
  };

  /** 무한스크롤 */
  const loadMoreProducts = async () => {
    const { dispatch, getState } = store;
    const state = getState();

    // 이미 로딩 중이거나 더 이상 로드할 데이터가 없으면 중단
    if (state.isLoadingMore || !state.pagination.hasNext || state.loading) {
      return;
    }

    try {
      dispatch(actions.setLoadingMore(true));

      const params = {
        ...getURLParams(),
        page: state.pagination.currentPage + 1,
      };

      const { products, pagination } = await getProducts(params);

      // 서버 응답에 hasNext가 없을 경우를 대비한 계산
      const enrichedPagination = {
        ...pagination,
        hasNext: pagination.hasNext ?? state.products.length + products.length < pagination.total,
      };

      dispatch(actions.appendProducts(products, enrichedPagination));
    } catch (error) {
      console.error("추가 상품 로딩 실패:", error);
      dispatch(actions.setLoadingMore(false));
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

  return { loadProducts, loadMoreProducts, loadCategories };
};
