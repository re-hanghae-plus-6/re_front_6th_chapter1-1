import { Navigation } from "../layout/navigation.js";
import { SkeletonProduct } from "../skeleton/skeletonProduct.js";
import { LoadingIndicator } from "../layout/loadingIndicator.js";
import { Footer } from "../layout/footer.js";
import { ProductGrid } from "../layout/productGrid.js";
import { Category } from "../category/category.js";

export const 상품목록_레이아웃_로딩 = `
<div class="min-h-screen bg-gray-50">
  ${Navigation({ cartItemCount: 6 })}
  <main class="max-w-md mx-auto px-4 py-4">
  ${Category()}
    <!-- 상품 목록 -->
    <div class="mb-6">
      <div>
        <!-- 상품 그리드 -->
        ${ProductGrid({
          children: `
          <!-- 로딩 스켈레톤 -->
          ${SkeletonProduct}
          ${SkeletonProduct}
          ${SkeletonProduct}
          ${SkeletonProduct}
          `,
        })}
        </div>
        ${LoadingIndicator}
    </div>
  </main>
  ${Footer}
</div>
`;
