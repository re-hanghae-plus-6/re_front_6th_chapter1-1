import { searchNcategoriesComp } from "../components/searchNcategoriesComp.js";
import { Header } from "../components/header.js";
import { Footer } from "../components/footer.js";
import { ProductList } from "../components/ProductList.js";

export const home = (statusHome) => {
  return /*html*/ `
    <div class="min-h-screen bg-gray-50">
      ${Header()}
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        ${searchNcategoriesComp(statusHome)}
        <!-- 상품 목록 -->
        ${ProductList({
          products: statusHome.products,
          total: statusHome.total,
          loading: statusHome.loading,
          limit: statusHome.params.limit,
        })}
      </main>
      ${Footer()}
    </div>
  `;
};
