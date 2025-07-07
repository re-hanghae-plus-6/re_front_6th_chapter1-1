import { ProductItemSkeleton } from "./ProductItemSkeleton";
import { ProductLoading } from "./ProductLoading";

export const ProductList = () => `
<div class="mb-6">
  <div>
    <!-- 상품 그리드 -->
    <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
      <!-- 로딩 스켈레톤 -->
      ${ProductItemSkeleton()}
      ${ProductItemSkeleton()}
      ${ProductItemSkeleton()}
      ${ProductItemSkeleton()}
    </div>
    ${ProductLoading()}
  </div>
</div>
`;
