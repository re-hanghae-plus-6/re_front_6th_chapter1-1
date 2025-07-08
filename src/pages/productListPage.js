import { ProductCard } from "../components/ProductCard.js";

const LIMIT_OPTIONS = [
  { value: 10, label: "10개" },
  { value: 20, label: "20개" },
  { value: 50, label: "50개" },
  { value: 100, label: "100개" },
];

const SORT_OPTIONS = [
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "name_asc", label: "이름순" },
  { value: "name_desc", label: "이름 역순" },
];

export const ProductListPage = ({
  products = [],
  loading = false,
  error = null,
  pagination = { total: 0, limit: 20 },
  filters = { sort: "price_asc" },
  categories = [],
  loadingCategories = false,
  categoriesError = null,
}) => {
  const renderProductCards = () => {
    if (error) {
      console.log(error);
      return `<p class="text-red-600">에러</p>`;
    }

    const currentProducts = products.map((product) => ProductCard({ product })).join("");

    const loadingSkeletons = loading ? ProductCard({ isLoading: true }).repeat(6) : "";

    return currentProducts + loadingSkeletons;
  };

  const renderCategories = () => {
    if (categoriesError) {
      return `<div class="text-sm text-red-500">카테고리 로딩 실패</div>`;
    }

    if (loadingCategories) {
      return `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`;
    }

    if (Object.keys(categories).length === 0) {
      return "";
    }

    const category1Buttons = Object.keys(categories)
      .map((category1) => {
        const isSelected = filters.category1 === category1;
        return `
          <button data-category1="${category1}" class="px-3 py-1 text-sm rounded-md transition-colors ${
            isSelected ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }">
            ${category1}
          </button>`;
      })
      .join("");

    return category1Buttons;
  };

  const renderSubCategories = () => {
    if (!filters.category1 || !categories[filters.category1]) return "";

    const subCategories = Object.keys(categories[filters.category1]);

    if (subCategories.length === 0) return "";

    return `
      <div class="flex flex-wrap gap-2 mt-2">
        ${subCategories
          .map((category2) => {
            const isSelected = filters.category2 === category2;
            return `
              <button 
                data-category1="${filters.category1}" 
                data-category2="${category2}" 
                class="px-3 py-1 text-sm rounded-md border transition-colors ${
                  isSelected
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }">
                  ${category2}
              </button>`;
          })
          .join("")}
      </div>
    `;
  };

  return `
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
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
            <div class="relative">
            <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${filters.search || ""}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
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
                ${filters.category1 ? `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" class="text-xs hover:text-blue-800 hover:underline">${filters.category1}</button>` : ""}
                ${filters.category2 ? `<span class="text-xs text-gray-500">&gt;</span><span class="text-xs text-gray-700">${filters.category2}</span>` : ""}
            </div>
            <!-- 1depth 카테고리 -->
            <div class="flex flex-wrap gap-2">
                ${renderCategories()}
            </div>
              <!-- 2depth 카테고리 -->
              ${renderSubCategories()}
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select id="limit-select"
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    ${LIMIT_OPTIONS.map(
                      (limit) =>
                        `<option value="${limit.value}" ${pagination.limit === limit.value ? "selected" : ""}>${limit.label}</option>`,
                    ).join("")}
                </select>
            </div>
            <!-- 정렬 -->
            <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                            focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    ${SORT_OPTIONS.map(
                      (sort) =>
                        `<option value="${sort.value}" ${filters.sort === sort.value ? "selected" : ""}>${sort.label}</option>`,
                    ).join("")}
                </select>
            </div>
            </div>
        </div>
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            ${
              loading
                ? `
                    <div class="mb-4 h-5"></div>
                    `
                : `
                    <div class="mb-4 text-sm text-gray-600">
                        총 <span class="font-medium text-gray-900">${pagination.total}개</span>의 상품
                    </div>
                    `
            }
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                ${renderProductCards()}
            </div>
            
            ${
              loading
                ? `
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
                `
                : ""
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
