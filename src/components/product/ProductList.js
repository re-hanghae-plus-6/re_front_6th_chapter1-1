import ProductItem from "./ProductItem";

export default function ProductList({ products, total }) {
  console.log("products: ", products);
  return /* HTML */ `<div class="mb-6">
    <div>
      <!-- 상품 개수 정보 -->
      <div class="mb-4 text-sm text-gray-600">
        총 <span class="font-medium text-gray-900">${total}개</span>의 상품
      </div>
      <!-- 상품 그리드 -->
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${products && products.length > 0 ? products.map(ProductItem).join("") : "상품이 없습니다."}
      </div>

      <div class="text-center py-4 text-sm text-gray-500">모든 상품을 확인했습니다</div>
    </div>
  </div>`;
}
