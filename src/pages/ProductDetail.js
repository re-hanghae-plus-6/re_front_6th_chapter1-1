import { loadProductDetail } from "../services/productDetailLoader";

export const ProductDetail = () => {
  ProductDetail.init = async () => {
    const productId = getProductIdFromUrl();
    if (productId) {
      await loadProductDetail(productId);
    }
  };

  return /* HTML */ `
    <main id="product-detail" class="max-w-md mx-auto px-4 py-4">
      <div class="py-20 bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    </main>
  `;
};

// URL에서 상품 ID를 추출하는 함수
function getProductIdFromUrl() {
  const pathParts = window.location.pathname.split("/");
  return pathParts[pathParts.length - 1];
}
