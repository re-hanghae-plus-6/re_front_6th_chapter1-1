import { Layout } from "../components/layout/Layout.js";

export const Home = () => {
  const contentHtml = /* html */ `
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색 필터 컨테이너 -->
        <div id="search-filter-container"></div>
        <!-- 카테고리 필터 컨테이너 -->
        <div id="category-filter-container"></div>
              </div>
      <!-- 상품 목록 컨테이너 -->
      <div id="product-list-container"></div>
      </main>
  `;

  return Layout(contentHtml);
};
