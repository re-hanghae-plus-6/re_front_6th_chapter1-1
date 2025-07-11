import mainStore from "../store/main.js";
import { getCategories, getProducts } from "../api/productApi.js";
import { getURLParams } from "../utils/url.js";
import { getAppPath } from "../utils/path.js";
import { updateProducts } from "../services/productService.js";
import { loadProductDetail } from "../services/productDetailService.js";
import { render } from "../core/renderer.js";

// 브라우저 뒤로가기/앞으로가기 지원
const setupPopstateHandler = () => {
  window.addEventListener("popstate", async () => {
    const currentPath = getAppPath();

    if (currentPath.startsWith("/product/")) {
      // 상품 상세 페이지
      const productId = currentPath.split("/")[2];
      await loadProductDetail(productId);
    } else if (currentPath === "/") {
      // 홈 페이지
      const urlParams = getURLParams();
      mainStore.setParams(urlParams);
      await updateProducts(urlParams);
    } else {
      // 404 페이지
      render();
    }
  });
};

// 초기 라우팅 처리
const handleInitialRoute = async () => {
  const currentPath = getAppPath();

  if (currentPath.startsWith("/product/")) {
    // 상품 상세 페이지로 직접 접근
    const productId = currentPath.split("/")[2];
    await loadProductDetail(productId);
  } else if (currentPath === "/") {
    // 홈 페이지 초기화
    await initializeHomePage();
  } else {
    // 404 페이지 처리
    render();
  }
};

// 홈 페이지 초기화
const initializeHomePage = async () => {
  // URL 파라미터 읽기
  const urlParams = getURLParams();
  mainStore.setParams(urlParams);

  // 페이지네이션 초기화
  mainStore.setPagination({
    limit: parseInt(urlParams.limit) || 20,
    page: 1,
  });

  mainStore.setLoading(true);
  render();

  const [
    {
      products,
      pagination: { hasNext, total, page, limit },
    },
    categories,
  ] = await Promise.all([
    getProducts({
      ...urlParams,
      page: 1,
      limit: mainStore.getPagination().limit,
    }),
    getCategories({}),
  ]);

  mainStore.setProducts(products);
  mainStore.setTotal(total);
  mainStore.setPagination({ page, limit, hasNext });
  mainStore.setCategories(categories);
  mainStore.setLoading(false);

  render();
};

export const initializeApp = async () => {
  // popstate 이벤트 설정
  setupPopstateHandler();

  // 초기 라우팅 처리
  await handleInitialRoute();
};
