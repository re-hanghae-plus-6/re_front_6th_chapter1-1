import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { LoadingSkeletonList } from "../components/LoadingSkeleton";
import { ProductItem } from "../components/ProductItem";
import { getURLParams } from "../utils/urlParams";

/** 카테고리 버튼 */
const CategoryButton = (category) => {
  return /*html*/ `
    <button data-category1="${category}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
      bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
      ${category}
    </button>
  `;
};

/** 검색 결과 없을 때 빈 상태 컴포넌트 */
const SearchEmptyState = ({ searchTerm }) => {
  return /*html*/ `
    <div class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
      <p class="text-gray-600 mb-4">"${searchTerm}"에 대한 상품을 찾을 수 없습니다.</p>
      <button onclick="window.location.href='/'" class="text-blue-600 hover:text-blue-800 text-sm">
        전체 상품 보기
      </button>
    </div>
  `;
};

/** 무한스크롤 로딩 인디케이터 */
const InfiniteScrollLoader = ({ isLoadingMore, hasNext, isInitialLoad }) => {
  // 초기 로드 중에는 센티넬 렌더링하지 않음
  if (isInitialLoad) {
    return "";
  }

  // 더 이상 로드할 상품이 없으면 완료 메시지
  if (!hasNext && !isLoadingMore) {
    return /*html*/ `
      <div class="text-center py-8 text-sm text-gray-500">
        모든 상품을 확인했습니다
      </div>
    `;
  }

  // 로딩 중일 때만 인디케이터 표시
  if (isLoadingMore) {
    return /*html*/ `
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
  }

  // 센티넬 요소 (보이지 않는 감시 요소)
  return /*html*/ `
    <div id="scroll-sentinel" style="height: 1px; margin-top: -1px;"></div>
  `;
};

export const ProductListPage = ({
  products = [],
  total = 0,
  loading = false,
  categories = {},
  isLoadingMore = false,
  pagination = { hasNext: true },
  isInitialLoad = false,
  cart = [],
}) => {
  const categoryList = Object.keys(categories);
  const currentParams = getURLParams();
  const cartCount = cart.length;

  // 검색 결과가 없는 경우 체크
  const hasSearchTerm = currentParams.search.length > 0;
  const hasNoResults = !loading && hasSearchTerm && products.length === 0;

  return /*html*/ `
    <div class="min-h-screen bg-gray-50">
      ${Header({ cartCount: cartCount })}
    <main class="max-w-md mx-auto px-4 py-4">
      <!-- 검색 및 필터 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
          <div class="relative">
            <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." 
                   value="${currentParams.search}" 
                   class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
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
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">카테고리:</label>
              <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
            </div>
            <!-- 1depth 카테고리 -->
            <div class="flex flex-wrap gap-2">
              ${
                loading
                  ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
                  : categoryList.map(CategoryButton).join("")
              }
            </div>
            <!-- 2depth 카테고리 -->
          </div>
          <!-- 기존 필터들 -->
          <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">개수:</label>
              <select id="limit-select"
                      class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="10" ${currentParams.limit === 10 ? "selected" : ""}>10개</option>
                <option value="20" ${currentParams.limit === 20 ? "selected" : ""}>20개</option>
                <option value="50" ${currentParams.limit === 50 ? "selected" : ""}>50개</option>
                <option value="100" ${currentParams.limit === 100 ? "selected" : ""}>100개</option>
              </select>
            </div>
            <!-- 정렬 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">정렬:</label>
              <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                          focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="price_asc" ${currentParams.sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
                <option value="price_desc" ${currentParams.sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
                <option value="name_asc" ${currentParams.sort === "name_asc" ? "selected" : ""}>이름순</option>
                <option value="name_desc" ${currentParams.sort === "name_desc" ? "selected" : ""}>이름 역순</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <!-- 상품 목록 -->
      <div class="mb-6">
        <div>
          <!-- 상품 개수 정보 -->
          ${
            loading
              ? ""
              : `
            <div class="mb-4 text-sm text-gray-600">
              ${
                hasSearchTerm
                  ? `총 <span class="font-medium text-gray-900">${total}개</span>의 상품`
                  : `총 <span class="font-medium text-gray-900">${total}개</span>의 상품`
              }
            </div>
            `
          }
          <!-- 상품 그리드 -->
          ${
            hasNoResults
              ? SearchEmptyState({ searchTerm: currentParams.search })
              : `
              <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                ${loading ? LoadingSkeletonList : products.map(ProductItem).join("")}
              </div>
              
              <!-- 무한스크롤 로더 또는 센티넬 -->
              ${!loading ? InfiniteScrollLoader({ isLoadingMore, hasNext: pagination.hasNext, isInitialLoad }) : ""}
            `
          }
        </div>
      </div>
    </main>
    ${Footer()}
  </div>
  `;
};
