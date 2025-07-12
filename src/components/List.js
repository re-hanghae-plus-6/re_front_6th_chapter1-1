import { ProductItem } from "./Product";

export const List = (productList, total) => {
  return /* HTML */ `
    <!-- 상품 목록 -->
    <div class="mb-6">
      <div>
        <!-- 상품 개수 정보 -->
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">${total}개</span>의 상품
        </div>
        <!-- 상품 그리드 -->
        <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
          ${productList
            .map((item) => {
              return ProductItem(item);
            })
            .join("")}
        </div>
      </div>
    </div>
  `;
};
