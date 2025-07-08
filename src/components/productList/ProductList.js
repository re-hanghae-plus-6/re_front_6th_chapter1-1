import { getCategories } from "../../api/productApi";
import { productsStore } from "../../store";
import { ProductItem } from "./ProductItem";
import { ProductItemSkeleton } from "./ProductItemSkeleton";
import { ProductLoading } from "./ProductLoading";

export const ProductList = () => {
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
};
