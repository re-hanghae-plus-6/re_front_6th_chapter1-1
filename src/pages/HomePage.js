import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { ProductGrid } from "../components/ProductGrid.js";
import { SearchFilter } from "../components/SearchFilter.js";

export function HomePage({ products }) {
  return `
    <div class="bg-gray-50 min-h-screen">
      ${Header()}
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 필터/검색창 생략 -->
        ${SearchFilter()}
        ${ProductGrid(products)}
      </main>
      ${Footer()}
    </div>
  `;
}
