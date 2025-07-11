import { getProduct, getProducts } from "../api/productApi.js";
import mainStore from "../store/main.js";
import { render } from "../core/renderer.js";
import { getFullPath } from "../utils/path.js";

export const loadProductDetail = async (productId) => {
  try {
    // 상품 상세 페이지 진입 시 수량을 1로 초기화
    mainStore.setSelectedQuantity(1);
    render();

    // 상품 상세 정보 로드 (새로운 getProduct API 사용)
    const product = await getProduct(productId);

    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }

    // 관련 상품 로드 (같은 카테고리)
    const { products: relatedProducts } = await getProducts({
      category1: product.category1,
      limit: 6,
    });

    // 현재 상품 제외한 관련 상품
    const filteredRelatedProducts = relatedProducts.filter((p) => p.productId !== productId).slice(0, 4);

    mainStore.setCurrentProduct(product);
    mainStore.setRelatedProducts(filteredRelatedProducts);

    render();
  } catch (error) {
    console.error("상품 상세 로딩 실패:", error);
    mainStore.setCurrentProduct(null);
    render();
  }
};

export const goBackToHome = () => {
  // 상품 상세에서 홈으로 돌아가기
  mainStore.setCurrentProduct(null);
  mainStore.setRelatedProducts([]);

  // URL을 홈으로 변경 (BASE_PATH 고려)
  const homePath = getFullPath("/");
  window.history.pushState({}, "", homePath);

  render();
};
