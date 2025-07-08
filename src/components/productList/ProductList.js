<<<<<<< HEAD
=======
import { getCategories } from "../../api/productApi";
>>>>>>> 91f244e (feat : product store구현 완료)
import { productsStore } from "../../store";
import { ProductItem } from "./ProductItem";
import { ProductItemSkeleton } from "./ProductItemSkeleton";
import { ProductLoading } from "./ProductLoading";

export const ProductList = () => {
<<<<<<< HEAD
  const { products, isLoading, pagination } = productsStore.state;

  return /* HTML */ `
    <div class="mb-6">
      <div>
        <!-- 상품 개수 정보 -->
        ${isLoading
          ? ""
          : `<div class="mb-4 text-sm text-gray-600">
            총 <span class="font-medium text-gray-900">${pagination.total}개</span>의 상품
          </div>`}
        <!-- 상품 그리드 -->
        <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
          <!-- 로딩 스켈레톤 -->
          ${isLoading
            ? Array.from({ length: 4 })
                .map(() => ProductItemSkeleton())
                .join("")
            : products.map((product) => ProductItem(product)).join("")}
        </div>
        ${isLoading ? ProductLoading() : ""}
      </div>
    </div>
  `;
=======
  const { products, isLoading } = productsStore.state;

  const data = getCategories();
  console.log("data", data);

  return `
<div class="mb-6">
  <div>
    <!-- 상품 그리드 -->
    <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
      <!-- 로딩 스켈레톤 -->
      ${
        isLoading
          ? Array.from({ length: 4 })
              .map(() => ProductItemSkeleton())
              .join("")
          : products.map((product) => ProductItem(product)).join("")
      }
    </div>
    ${isLoading ? ProductLoading() : ""}
  </div>
</div>
`;
>>>>>>> 91f244e (feat : product store구현 완료)
};
