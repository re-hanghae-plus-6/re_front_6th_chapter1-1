import { LIMIT_OPTIONS, renderOptions, SORT_OPTIONS } from "../../utils/productFilterUtils";
import { category1DepthButton, category2DepthButton } from "../filter/CategoryButton";

const ProductFilter = (searchQuery) => {
  /**검색 쿼리 */
  const {
    categories = {},
    selectedCategory1 = "",
    selectedCategory2 = "",
    isLoading = false,
    limit = 20,
    sort = "price_asc",
    search = "",
  } = searchQuery;

  // limit을 문자열로 변환
  const limitValue = String(limit);

  const renderBreadcrumb = () => {
    const crumbs = [
      `<button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>`,
    ];

    if (selectedCategory1) {
      crumbs.push(
        `<span class="text-xs text-gray-500">&gt;</span>`,
        `<button data-breadcrumb="category1" data-category1="${selectedCategory1}" class="text-xs hover:text-blue-800 hover:underline">${selectedCategory1}</button>`,
      );
    }

    if (selectedCategory2) {
      crumbs.push(
        `<span class="text-xs text-gray-500">&gt;</span>`,
        `<span class="text-xs text-gray-600 cursor-default">${selectedCategory2}</span>`,
      );
    }

    return crumbs.join("");
  };

  const renderCategoryButtons = () => {
    if (isLoading) return `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`;
    if (Object.keys(categories).length === 0)
      return `<div class="text-sm text-gray-500">카테고리 데이터가 없습니다.</div>`;

    return !selectedCategory1
      ? category1DepthButton(categories)
      : category2DepthButton(categories, selectedCategory1, selectedCategory2);
  };

  return /* HTML */ `
    <!-- 검색 및 필터 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <!-- 검색창 -->
      <div class="mb-4">
        <div class="relative">
          <input
            type="text"
            id="search-input"
            placeholder="상품명을 검색해보세요..."
            value="${search}"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
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
            ${renderBreadcrumb()}
          </div>
          <div class="space-y-2">
            <div class="flex flex-wrap gap-2">${renderCategoryButtons()}</div>
          </div>
        </div>

        <!-- 기존 필터들 -->
        <div class="flex gap-2 items-center justify-between">
          <!-- 페이지당 상품 수 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">개수:</label>
            <select
              id="limit-select"
              class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              ${renderOptions(LIMIT_OPTIONS, limitValue)}
            </select>
          </div>

          <!-- 정렬 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">정렬:</label>
            <select
              id="sort-select"
              class="text-sm border border-gray-300 rounded px-2 py-1
                     focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              ${renderOptions(SORT_OPTIONS, sort)}
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default ProductFilter;
