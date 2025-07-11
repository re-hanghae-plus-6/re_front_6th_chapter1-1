import mainStore from "../store/main.js";
import { getProducts } from "../api/productApi.js";
import { getURLParams } from "../utils/url.js";
import { render } from "../core/renderer.js";

export const updateLimit = async (limit = 20) => {
  mainStore.setPagination({
    limit,
  });

  try {
    const params = getURLParams();

    const {
      products,
      pagination: { hasNext, total, page },
    } = await getProducts({ ...params, limit, page: 1 });

    mainStore.setProducts(products);
    mainStore.setTotal(total);
    mainStore.setPagination({ hasNext, page });

    render();
  } catch (error) {
    console.error("상품 로딩 실패:", error);
    render();
  }
};

export const updateCategory = async (category, depth = 1) => {
  // depth 0은 전체 카테고리 리셋
  if (depth === 0) {
    mainStore.setParams({ category1: "", category2: "" });
  } else {
    mainStore.setParams({ [`category${depth}`]: category });
    // 하위 카테고리 초기화
    if (depth === 1) mainStore.setParams({ category2: "" });
  }

  mainStore.resetPagination(); // 카테고리 변경시 페이지 리셋

  render();

  try {
    const params = getURLParams();
    const requestParams = { ...params, page: 1 };

    // depth에 따른 카테고리 파라미터 설정
    if (depth === 0) {
      // 전체 카테고리일 때는 카테고리 파라미터 제거
      delete requestParams.category1;
      delete requestParams.category2;
    } else {
      requestParams[`category${depth}`] = category;
      // 1depth 선택시 2depth 제거
      if (depth === 1) {
        delete requestParams.category2;
      }
    }

    const {
      products,
      pagination: { hasNext, total, page, limit },
    } = await getProducts(requestParams);

    mainStore.setProducts(products);
    mainStore.setTotal(total);
    mainStore.setPagination({ hasNext, page, limit });

    render();
  } catch (error) {
    console.error("카테고리 상품 로딩 실패:", error);

    render();
  }
};

export const updateProducts = async (params = {}, append = false) => {
  if (append) {
    mainStore.setLoadingMore(true);
  } else {
    mainStore.setLoading(true);
    mainStore.resetPagination(); // 새로운 검색/필터시 페이지 리셋
  }

  render();

  try {
    const mainState = mainStore.getState();

    const requestParams = {
      ...params,
      page: append ? mainState.pagination.page + 1 : 1,
      limit: mainState.pagination.limit,
      search: params.search || mainState.params.search || "",
    };

    const {
      products,
      pagination: { hasNext, total, page, limit },
    } = await getProducts(requestParams);

    if (append) {
      // 기존 상품에 추가
      mainStore.appendProducts(products);
      mainStore.setPagination({ page });
    } else {
      // 새로운 상품으로 대체
      mainStore.setProducts(products);
      mainStore.setPagination({ page });
    }

    mainStore.setTotal(total);
    mainStore.setPagination({ limit, hasNext });
    mainStore.setLoading(false);
    mainStore.setLoadingMore(false);

    render();
  } catch (error) {
    console.error("상품 로딩 실패:", error);
    mainStore.setLoading(false);
    mainStore.setLoadingMore(false);
    render();
  }
};

export const loadMoreProducts = async () => {
  const mainState = mainStore.getState();
  if (mainState.loadingMore || !mainState.pagination.hasNext) return;

  const params = getURLParams();
  await updateProducts(params, true); // append = true
};
