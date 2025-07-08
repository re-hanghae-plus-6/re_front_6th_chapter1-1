import { ProductCard } from "./ProductCard.js";
export function ProductGrid(products) {
  return `
    <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
      ${products.map(ProductCard).join("")}
    </div>
  `;
}
