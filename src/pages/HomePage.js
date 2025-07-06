import { DefaultHeader } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { ProductSkeletonCard } from "../components/product/ProductSkeletonCard";
import { LoadingIndicator } from "../components/common/LoadingIndicator";
import { ProductFilterPanel } from "../components/product/ProductFilterPanel";

export const HomePage = () => {
  return /*html*/ `
  <div class="min-h-screen bg-gray-50">
    ${DefaultHeader()}
    <main class="max-w-md mx-auto px-4 py-4">
      <!-- 상품 필터 패널 -->
      ${ProductFilterPanel()}
      <!-- 상품 목록 -->
      <div class="mb-6">
        <div>
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
            <!-- 로딩 스켈레톤 -->
            ${Array(4)
              .fill(null)
              .map(() => ProductSkeletonCard())
              .join("")}
          </div>
          
          ${LoadingIndicator("상품을 불러오는 중...")}
        </div>
      </div>
    </main>
    ${Footer()}
  </div>
`;
};
