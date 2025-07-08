import { Header } from "../components/Header";
import { CategoryFilter, ProductCountPerPage, ProductArrange } from "../components/Filters";

const LoadingUI = () => {
  return `<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            <div class="aspect-square bg-gray-200"></div>
            <div class="p-3">
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div class="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>`;
};

// 배열 리턴
const LoadingUIList = Array.from({ length: 4 }, () => LoadingUI());

const ProductCard = (product) => {
  return ` <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
               data-product-id="${product.productId}">
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
                <p class="text-xs text-gray-500 mb-2">${product.mallName}</p>
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

const PageLoadingSpinner = () => {
  return `
     <div class="text-center py-4">
          <div class="inline-flex items-center">
            <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
          </div>
        </div>
  `;
};

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
}) => {
  const categoryList = Object.keys(categories);

  return `
<div class="min-h-screen bg-gray-50">
 ${Header({ cart })}
  <main class="max-w-md mx-auto px-4 py-4">
    <!-- 검색 및 필터 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <!-- 검색창 -->
      <div class="mb-4">
        <div class="relative">
          <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      <!-- 필터 옵션 -->
      <div class="space-y-3">
        <!-- 카테고리 필터 -->
        ${CategoryFilter({ categoryList, selectedCategory1, loading })}
        <!-- 기존 필터들 -->
        <div class="flex gap-2 items-center justify-between">
          <!-- 페이지당 상품 수 -->
            ${ProductCountPerPage({ productCount })}
          <!-- 정렬 -->
          ${ProductArrange({ sort })}
        </div>
      </div>
    </div>
    <!-- 상품 목록 -->
    <div class="mb-6">
      <div>
          ${loading ? "" : ` <div class="mb-4 text-sm text-gray-600">총 <span class="font-medium text-gray-900">${total}</span>개의 상품  </div>`}
        <!-- 상품 그리드 -->
        <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
          <!-- 로딩 스켈레톤 -->
          ${loading ? LoadingUIList.join("") : products.map((product) => ProductCard(product)).join("")}
        </div>
        <!-- 무한 스크롤 감지 요소 -->
        <div id="scroll-sentinel"></div>
        ${hasNext ? PageLoadingSpinner() : ""}

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
