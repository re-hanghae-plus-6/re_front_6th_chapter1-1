import { ProductItem } from "./ProductItem";
import { ProductItemSkeleton } from "./ProductItemSkeleton";

export const ProductSection = ({ products = [], isLoading = false, total = 0, hasNext = false }) => {
  function renderProducts() {
    if (isLoading && products.length === 0) {
      return Array.from({ length: 4 })
        .map(() => ProductItemSkeleton())
        .join("");
    }

    return /* HTML */ products.map((product) => ProductItem(product)).join("");
  }

  function renderEndMessage(hasNext) {
    if (hasNext) return "";

    return `<div class="text-center py-4 text-sm text-gray-500">모든 상품을 확인했습니다</div>`;
  }

  return /* HTML */ ` <div class="mb-6">
    <div>
      <!-- 상품 개수 정보 -->
      <div class="mb-4 text-sm text-gray-600">총 <span class="font-medium text-gray-900">${total}개</span>의 상품</div>
      <!-- 상품 그리드 -->
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">${renderProducts()}</div>
      ${renderEndMessage(hasNext)}
    </div>
  </div>`;
};
