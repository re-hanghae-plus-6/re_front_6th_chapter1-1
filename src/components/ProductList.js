import ProductCard from "./ProductCard";

export default function ProductList({ products, pagination }) {
  return /* html */ `
    <div class="mb-6" id="product-list">
      <div>
        <!-- 상품 개수 정보 -->
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">${pagination?.total}개</span>의 상품
        </div>
        <!-- 상품 그리드 -->
        <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
          ${products?.map((product) => ProductCard(product)).join("")}
        </div>
      </div>
    </div>
  `;
}
