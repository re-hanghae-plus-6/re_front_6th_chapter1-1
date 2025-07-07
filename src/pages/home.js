import { searchNcategoriesComp } from "../components/searchNcategoriesComp.js";
const homeLoadingUI = /*html*/ `
<!-- 로딩 스켈레톤 -->
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

const productItem = (product) => {
  return /*html*/ `<!-- 상품 정보 -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" data-product-id=${product.productId}">
    <!-- 상품 이미지 -->
    <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
      <img src="${product.image}"
            alt="${product.title}"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            loading="lazy">
    </div>
    <!-- 상품 정보 -->
    <div class="p-3">
      <div class="cursor-pointer product-info mb-3">
        <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
          ${product.title}
        </h3>
        <p class="text-xs text-gray-500 mb-2"></p>
        <p class="text-lg font-bold text-gray-900">
          ${product.lprice}원
        </p>
      </div>
      <!-- 장바구니 버튼 -->
      <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
              hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${product.productId}">
        장바구니 담기
      </button>
    </div>
  </div>
  `;
};
export const home = (statusHome) => {
  // 리스트 개수 필터 초기 값에 따른 로딩 UI 설정
  const homeLoadingUIs = homeLoadingUI.repeat(statusHome.params.limit);
  return /*html*/ `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900">
              <a href="/" data-link="">쇼핑몰</a>
            </h1>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        ${searchNcategoriesComp(statusHome)}
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            <!-- 상품 개수 정보 -->
            ${
              statusHome.loading
                ? ""
                : /*html*/ `
            <div class="mb-4 text-sm text-gray-600">
              총 <span class="font-medium text-gray-900">${statusHome.total}개</span>의 상품
            </div>`
            }
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              ${
                statusHome.loading
                  ? homeLoadingUIs
                  : `
                ${statusHome.products.map(productItem).join("")}
                `
              }                
            </div>
            ${
              statusHome.loading
                ? /*html*/ `
            <div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
              </div>
            </div>`
                : ``
            }
            
          </div>
        </div>
      </main>

      <footer class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    </div>
  `;
};
