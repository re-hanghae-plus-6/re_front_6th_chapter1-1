import ProductItem from "./ProductItem.js";
import ProductSkeleton from "./ProductSkeleton.js";
import { LoadingSpinner } from "./Loading.js";

export default function ProductGrid({ products = [], total = 0, loading = false, hasMore = true }) {
  const renderProducts = () => {
    if (loading && products.length === 0) {
      return ProductSkeleton({ count: 4 });
    }

    return `
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                ${products.map((product) => ProductItem({ product })).join("")}
            </div>
        `;
  };

  const renderLoadMore = () => {
    if (loading && products.length > 0) {
      return LoadingSpinner();
    }

    if (!hasMore && products.length > 0) {
      return `
                <div class="text-center py-4 text-sm text-gray-500">
                    모든 상품을 확인했습니다
                </div>
            `;
    }

    return "";
  };

  return `
        <div class="mb-6">
            <div>
                <!-- 상품 개수 정보 -->
                ${
                  loading
                    ? ""
                    : `
                    <div class="mb-4 text-sm text-gray-600">
                        총 <span class="font-medium text-gray-900">${total}개</span>의 상품
                    </div>
                `
                }
                ${renderProducts()}
                ${renderLoadMore()}
            </div>
        </div>
    `;
}
