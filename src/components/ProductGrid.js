import { ProductCard, ProductCardSkeleton } from "./ProductCard.js";
export function ProductGrid(products) {
  return `
   ${
     Array.isArray(products) && products.length
       ? `<div class="mb-4 text-sm text-gray-600">
         총 <span class="font-medium text-gray-900">${340}개</span>의 상품
       </div>`
       : ""
   }
    <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
      ${
        Array.isArray(products) && products.length
          ? products.map(ProductCard).join("")
          : Array.from({ length: 10 })
              .map(() => ProductCardSkeleton)
              .join("")
      }
    </div>
  `;
}
