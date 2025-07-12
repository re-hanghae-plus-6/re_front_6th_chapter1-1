import { productStore, productActions } from "../store/productStore.js";
import { getProducts } from "../api/productApi.js";

/**
 * 홈 페이지 컴포넌트
 * - 상품 목록을 표시하는 메인 컴포넌트
 */
export function Home() {
  const state = productStore.getState();

  // 안전한 destructuring - filters는 기본값 없이 처리
  const { products = [], total = 0, isLoading = false, error = null, filters } = state || {};

  // filters가 없는 경우에만 기본값 설정
  const safeFilters = filters || { limit: 20, search: "", category1: "", category2: "", sort: "price_asc" };

  return `
    <div class="home-page">
      <!-- 검색 및 필터 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
          <div class="relative">
            <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${safeFilters.search}" 
                   class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- 필터 옵션 -->
        <div class="space-y-3">
          <!-- 카테고리 필터 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">카테고리:</label>
              <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
            </div>
            <!-- 1depth 카테고리 -->
            <div class="flex flex-wrap gap-2">
              <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
            </div>
          </div>
          
          <!-- 기존 필터들 -->
          <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">개수:</label>
              <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="10" ${safeFilters.limit === 10 ? "selected" : ""}>10개</option>
                <option value="20" ${safeFilters.limit === 20 ? "selected" : ""}>20개</option>
                <option value="50" ${safeFilters.limit === 50 ? "selected" : ""}>50개</option>
                <option value="100" ${safeFilters.limit === 100 ? "selected" : ""}>100개</option>
              </select>
            </div>
            <!-- 정렬 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">정렬:</label>
              <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="price_asc" ${safeFilters.sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
                <option value="price_desc" ${safeFilters.sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
                <option value="name_asc" ${safeFilters.sort === "name_asc" ? "selected" : ""}>이름순</option>
                <option value="name_desc" ${safeFilters.sort === "name_desc" ? "selected" : ""}>이름 역순</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 상품 목록 섹션 -->
      ${renderProductSection(products, total, isLoading, error)}
    </div>
  `;
}

/**
 * 상품 데이터를 API에서 불러오는 함수
 */
export function loadProducts() {
  // 현재 store에서 필터 정보 가져오기
  const currentState = productStore.getState();
  const { filters } = currentState;

  // 로딩 상태 설정
  productActions.setLoading(true);

  // API 호출 - store의 필터 정보 사용
  return getProducts(filters)
    .then((response) => {
      // 상태 업데이트 - Mock API 응답 구조에 맞춤
      productActions.setProducts(response.products, response.pagination.total);

      // 페이지네이션 상태 업데이트
      productActions.updatePagination({
        currentPage: 1,
        hasNextPage: response.products.length < response.pagination.total,
      });
    })
    .catch((error) => {
      console.error("상품 데이터 로딩 실패:", error);
      productActions.setError(error.message);
    });
}

/**
 * 무한 스크롤용 추가 상품 로드 함수
 */
export function loadMoreProducts() {
  const currentState = productStore.getState();
  const { filters, pagination, products, isLoading } = currentState;

  // 이미 로딩 중이거나 더 이상 로드할 데이터가 없으면 중단
  if (isLoading || !pagination.hasNextPage) {
    return Promise.resolve();
  }

  // 로딩 인디케이터 즉시 표시
  showInfiniteScrollLoading();

  // 다음 페이지 번호 계산
  const nextPage = pagination.currentPage + 1;
  const nextFilters = { ...filters, page: nextPage };

  // 로딩 상태 설정
  productActions.setLoading(true);

  // 무한 스크롤 상태 설정
  window.isInfiniteScrolling = true;

  // API 호출 - 다음 페이지 데이터 요청
  return getProducts(nextFilters)
    .then((response) => {
      // 페이지네이션 상태 먼저 업데이트
      productActions.updatePagination({
        currentPage: nextPage,
        hasNextPage:
          response.products.length > 0 && products.length + response.products.length < response.pagination.total,
      });

      // 기존 상품에 추가 (append: true)
      productActions.setProducts(response.products, response.pagination.total, true);
    })
    .catch((error) => {
      console.error("💥 추가 상품 로딩 실패:", error);
      productActions.setError(error.message);
    })
    .finally(() => {
      // 로딩 인디케이터 제거
      hideInfiniteScrollLoading();

      // 무한 스크롤 상태 해제
      setTimeout(() => {
        window.isInfiniteScrolling = false;
      }, 100);
    });
}

/**
 * 상품 목록 섹션 렌더링
 */
function renderProductSection(products, total, isLoading, error) {
  if (error) {
    return `
      <div class="text-center py-8">
        <div class="text-red-500 mb-4">
          <p class="text-sm">상품을 불러오는 중 오류가 발생했습니다.</p>
          <p class="text-xs text-gray-600">${error}</p>
        </div>
        <button onclick="window.location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          다시 시도
        </button>
      </div>
    `;
  }

  if (isLoading) {
    return `
      <div class="mb-6">
        <div>
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
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
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-3">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-3">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-3">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          <div class="text-center py-4">
            <div class="inline-flex items-center">
              <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (products.length === 0) {
    return `
      <div class="text-center py-8">
        <p class="text-gray-500">상품이 없습니다.</p>
        <p class="text-sm text-gray-400">다른 검색어나 필터를 시도해보세요.</p>
      </div>
    `;
  }

  return `
    <div class="mb-6">
      <div>
        <!-- 상품 개수 정보 -->
        <div class="mb-4 text-sm text-gray-600" data-testid="product-count">
          총 <span class="font-medium text-gray-900" data-testid="product-total">${total.toLocaleString()}개</span>의 상품
        </div>
        
        <!-- 상품 그리드 -->
        <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
          ${products.map((product) => renderProductCard(product)).join("")}
        </div>
        
        ${renderLoadMoreSection(isLoading, products.length, total)}
      </div>
    </div>
  `;
}

/**
 * 개별 상품 카드 렌더링
 * Mock API 데이터 구조 사용: title, lprice, productId, brand, image
 */
function renderProductCard(product) {
  return `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" 
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
          ${product.brand ? `<p class="text-xs text-gray-500 mb-2">${product.brand}</p>` : ""}
          <p class="text-lg font-bold text-gray-900">
            ${parseInt(product.lprice).toLocaleString()}원
          </p>
        </div>
        
        <!-- 장바구니 버튼 -->
        <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" 
                data-product-id="${product.productId}">
          장바구니 담기
        </button>
      </div>
    </div>
  `;
}

/**
 * 무한 스크롤 로딩 섹션 렌더링
 */
function renderLoadMoreSection(isLoading, currentCount, total) {
  // 로딩 중일 때
  if (isLoading && currentCount > 0) {
    return `
      <div class="text-center py-4">
        <div class="inline-flex items-center">
          <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
        </div>
      </div>
    `;
  }

  // 모든 상품을 로드했을 때
  if (currentCount >= total) {
    return `
      <div class="text-center py-4 text-sm text-gray-500">
        모든 상품을 확인했습니다
      </div>
    `;
  }

  // 더 로드할 상품이 있을 때
  return `
    <div class="text-center py-4 text-sm text-gray-500">
      스크롤하여 더 많은 상품을 확인하세요
    </div>
  `;
}

/**
 * 무한 스크롤 로딩 인디케이터 표시
 */
function showInfiniteScrollLoading() {
  // 기존 로딩 인디케이터 제거
  hideInfiniteScrollLoading();

  const productsGrid = document.querySelector("#products-grid");

  if (productsGrid) {
    const loadingHTML = `
      <div id="infinite-scroll-loading" class="text-center py-4">
        <div class="inline-flex items-center">
          <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
        </div>
      </div>
    `;

    productsGrid.insertAdjacentHTML("afterend", loadingHTML);
  }
}

/**
 * 무한 스크롤 로딩 인디케이터 제거
 */
function hideInfiniteScrollLoading() {
  const loadingElement = document.querySelector("#infinite-scroll-loading");
  if (loadingElement) {
    loadingElement.remove();
  }
}
