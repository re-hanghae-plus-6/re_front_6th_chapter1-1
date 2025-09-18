import { FilterPanel, LoadingIndicator, ProductSkeletonGrid, SearchBar } from "../components/index.js";
import PageLayout from "../components/layout/PageLayout.js";
export const lifeCycle = new WeakMap();
// const initLifeCycle = { mount: null, mounted: null, unmounted: null, updated: null };

// const mounted = async () => {
//   const { products: newProducts, categories: newCategories } = await loadProductsandCategories();

//   return {
//     products: newProducts,
//     categories: newCategories,
//   };
// };

// // unmounted
// const unmounted = () => {
//   console.log("unmounted");
// };

// // updated
// const updated = () => {
//   console.log("updated");
// };

const Home = () => {
  return PageLayout({
    headerLeft: `
      <h1 class="text-xl font-bold text-gray-900">
        <a href="/" data-link="">쇼핑몰</a>
      </h1>
    `,
    children: `
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        ${SearchBar()}      
        ${FilterPanel()}
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            <!-- 상품 그리드 -->
            ${ProductSkeletonGrid()}
            ${LoadingIndicator()}
          </div>
        </div>
  `,
  });
};

export default Home;
