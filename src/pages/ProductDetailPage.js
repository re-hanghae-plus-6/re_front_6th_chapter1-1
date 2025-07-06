import { Footer } from "../components/common/Footer";
import { ProductDetailHeader } from "../components/common/Header";

export const ProductDetailPage = (id) => {
  console.log("상품 상세 페이지 ID:", id);
  return /*html*/ `
    <div class="min-h-screen bg-gray-50">
      ${ProductDetailHeader()}
      <main class="max-w-md mx-auto px-4 py-4">
        <div class="py-20 bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">상품 정보를 불러오는 중...</p>
          </div>
        </div>
      </main>
      ${Footer()}
    </div>
  `;
};
