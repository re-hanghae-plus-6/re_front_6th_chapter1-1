import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoryFilter, ProductCountPerPage, ProductArrange } from "../components/Filters";
import { Footer } from "../components/Footer";
import { ProductList } from "../components/ProductList";

export const HomePage = ({
  products = [],
  total = 0,
  loading = false,
  categories = {},
  productCount = 20,
  hasNext = false,
  sort = "price_asc",
  cart = [],
  selectedCategory1 = null,
  selectedCategory2 = null,
  search = "",
}) => {
  const categoryList = Object.keys(categories);

  /*html*/
  return `
<div class="min-h-screen bg-gray-50">
 ${Header({ cart })}
  <main class="max-w-md mx-auto px-4 py-4">
    <!-- 검색 및 필터 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <!-- 검색창 -->
      ${SearchBar({ search })}

      <!-- 필터 옵션 -->
      <div class="space-y-3">
        <!-- 카테고리 필터 -->
        ${CategoryFilter({ categoryList, selectedCategory1, selectedCategory2, loading })}
        <!-- 기존 필터들 -->
        <div class="flex gap-2 items-center justify-between">
          ${ProductCountPerPage({ productCount })}
          ${ProductArrange({ sort })}
        </div>
      </div>
    </div>
    <!-- 상품 목록 -->
    ${ProductList({ products, loading, total, hasNext })}
  </main>
  ${Footer()}
</div>
`;
};
