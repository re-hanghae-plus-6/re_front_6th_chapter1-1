import ProductItem from "./ProductItem.js";

export const ProductItemList = () => {
  return /* HTML */ `
    <div>
      <!-- 상품 개수 정보 -->
      <div class="mb-4 text-sm text-gray-600">총 <span class="font-medium text-gray-900">340개</span>의 상품</div>
      <!-- 상품 그리드 -->
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${ProductItem()} ${ProductItem()} ${ProductItem()}
      </div>

      <div class="text-center py-4 text-sm text-gray-500">모든 상품을 확인했습니다</div>
    </div>
  `;
};
