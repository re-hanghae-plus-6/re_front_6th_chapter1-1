import { getProducts, getCategories } from "../api/productApi.js";
import { getURLParams, updateSingleParam } from "../utils/urlParams.js";
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

    if (state.isLoadingMore || !state.pagination.hasNext || state.loading) {
      return;
    }

    try {
      dispatch(actions.setLoadingMore(true));

      // URL의 current 파라미터를 사용해서 다음 페이지 계산
      const urlParams = getURLParams();
      const nextPage = urlParams.current + 1;

      const params = {
        ...urlParams,
        page: nextPage,
      };

      const { products, pagination } = await getProducts(params);

      const enrichedPagination = {
        ...pagination,
        hasNext: pagination.hasNext ?? state.products.length + products.length < pagination.total,
      };

      dispatch(actions.appendProducts(products, enrichedPagination));

      // 무한스크롤 시 URL의 current 파라미터 업데이트 (current > 1일 때만 URL에 포함)
      updateSingleParam("current", nextPage, { replace: true });
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
