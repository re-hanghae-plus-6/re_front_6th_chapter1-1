// src/components/ProductList.js
import { ProductCard } from "./ProductCard.js";
import { ProductLoadingSkeleton } from "./productLoadingSkeleton.js"; // 기존 스켈레톤 재사용

export const ProductList = ({ products, total, loading, limit }) => {
  const productCardsHtml = loading
    ? ProductLoadingSkeleton().repeat(limit) // 로딩 중일 때 스켈레톤 표시
    : products.map(ProductCard).join(""); // 데이터 로드 완료 시 실제 상품 카드 표시

  const totalCountHtml = loading
    ? ""
    : /*html*/ `
      <div class="mb-4 text-sm text-gray-600">
        총 <span class="font-medium text-gray-900">${total}개</span>의 상품
      </div>`;

  const loadingSpinnerHtml = loading
    ? /*html*/ `
      <div class="text-center py-4">
        <div class="inline-flex items-center">
          <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
        </div>
      </div>`
    : ``;

  return /*html*/ `
    <div class="mb-6">
      <div>
        <!-- 상품 개수 정보 -->
        ${totalCountHtml}
        <!-- 상품 그리드 -->
        <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
          ${productCardsHtml}                
        </div>
        ${loadingSpinnerHtml}
      </div>
    </div>
  `;
};
