import { createLayout } from "../components/layout/layout.js";
import { createSearchFilter } from "../components/SearchFilter.js";
import { createProductList } from "../components/ProductCard.js";

/**
 * 상품 목록 페이지의 메인 콘텐츠를 생성하는 함수
 * @param {Array} products - 상품 데이터 배열
 * @param {Object} options - 렌더링 옵션
 * @returns {string} 메인 콘텐츠 HTML
 */
function createProductListContent(products = [], options = {}) {
  const {
    totalCount = 0,
    isLoading = false,
    searchValue = "",
    selectedLimit = "20",
    selectedSort = "price_asc",
  } = options;

  const productListHTML = isLoading ? createLoadingState() : createProductList(products);

  return `
    <main class="max-w-md mx-auto px-4 py-4">
      ${createSearchFilter({ searchValue, selectedLimit, selectedSort })}
      
      <!-- 상품 목록 -->
      <div class="mb-6">
        <div>
          <!-- 상품 개수 정보 -->
          <div class="mb-4 text-sm text-gray-600">
            총 <span class="font-medium text-gray-900">${totalCount}개</span>의 상품
          </div>
          
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
            ${productListHTML}
          </div>
          
          ${
            !isLoading && products.length > 0
              ? `
            <div class="text-center py-4 text-sm text-gray-500">
              모든 상품을 확인했습니다
            </div>
          `
              : ""
          }
        </div>
      </div>
    </main>
  `;
}

/**
 * 상품 목록 페이지 HTML을 생성하는 함수
 * @param {Array} products - 상품 데이터 배열
 * @param {Object} options - 렌더링 옵션
 * @returns {string} 상품 목록 페이지 HTML
 */
export function createProductListPage(products = [], options = {}) {
  const { cartCount = 0 } = options;

  const content = createProductListContent(products, options);

  return createLayout(content, { cartCount });
}

/**
 * 로딩 상태의 스켈레톤 UI를 생성하는 함수
 * @returns {string} 로딩 스켈레톤 HTML
 */
function createLoadingState() {
  const skeletonCard = `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div class="aspect-square bg-gray-200"></div>
      <div class="p-3">
        <div class="h-4 bg-gray-200 rounded mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div class="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  `;

  return skeletonCard.repeat(4);
}
