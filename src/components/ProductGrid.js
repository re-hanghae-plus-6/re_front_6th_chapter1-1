import { ProductCard, ProductCardSkeleton } from "./ProductCard.js";
export function ProductGrid(products) {
  return `
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
