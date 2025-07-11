import ProductItem from "./ProductItem.js";
import ProductSkeleton from "./ProductSkeleton.js";
import { LoadingSpinner } from "../ui/Loading.js";

export default function ProductGrid({ products = [], totalCount = 0, isLoading = false, hasMore = true }) {
  const renderProducts = () => {
    if (isLoading && products.length === 0) {
      return ProductSkeleton({ count: 4 });
    }

    if (products.length === 0) {
      return /*html*/ `
        <div class="col-span-2 text-center py-8 text-gray-500">
          상품이 없습니다.
        </div>
      `;
    }

    return /*html*/ `
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${products.map((product) => ProductItem({ product })).join("")}
      </div>
    `;
  };

  const renderLoadMore = () => {
    if (isLoading && products.length > 0) {
      return LoadingSpinner({ message: "상품을 불러오는 중..." });
    }

    if (!hasMore && products.length > 0) {
      return /*html*/ `
        <div class="text-center py-4 text-sm text-gray-500">
          모든 상품을 확인했습니다
        </div>
      `;
    }

    return "";
  };

  return /*html*/ `
    <div class="mb-6">
      <div>
        ${
          totalCount > 0
            ? /*html*/ `
          <div class="mb-4 text-sm text-gray-600">
            총 <span class="font-medium text-gray-900">${totalCount}개</span>의 상품
          </div>
        `
            : ""
        }
        
        ${renderProducts()}
        ${renderLoadMore()}
      </div>
    </div>
  `;
}
