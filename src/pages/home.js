import { searchNcategoriesComp } from "../components/searchNcategoriesComp.js";
import { Header } from "../components/header.js";
import { Footer } from "../components/footer.js";
import { ProductList } from "../components/ProductList.js";

export const home = (mainStatus) => {
  return /*html*/ `
    <div class="min-h-screen bg-gray-50">
      ${Header()}
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        ${searchNcategoriesComp(mainStatus)}
        <!-- 상품 목록 -->
        ${ProductList({
          products: mainStatus.products,
          total: mainStatus.total,
          loading: mainStatus.loading,
          limit: mainStatus.params.limit,
        })}
      </main>
      ${Footer()}
    </div>
  `;
};
