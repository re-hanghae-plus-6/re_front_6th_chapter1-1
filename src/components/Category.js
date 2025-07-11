import { Select } from "./common/Select.js";

export const Category = (
  categories = {},
  currentCategory1 = "",
  currentCategory2 = "",
  currentLimit = 20,
  currentSort = "price_asc",
  currentSearch = "",
) => {
  // 브레드크럼 구성
  const breadcrumbItems = [];
  breadcrumbItems.push(
    `<button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>`,
  );
  if (currentCategory1) {
    breadcrumbItems.push(`<span class="text-xs text-gray-500">&gt;</span>`);
    breadcrumbItems.push(
      `<button data-breadcrumb="category1" data-category1="${currentCategory1}" class="text-xs hover:text-blue-800 hover:underline">${currentCategory1}</button>`,
    );
  }
  if (currentCategory2) {
    breadcrumbItems.push(`<span class="text-xs text-gray-500">&gt;</span>`);
    breadcrumbItems.push(
      `<button data-breadcrumb="category2" data-category1="${currentCategory1}" data-category2="${currentCategory2}" class="text-xs hover:text-blue-800 hover:underline">${currentCategory2}</button>`,
    );
  }
  const breadcrumbHtml = breadcrumbItems.join("");

  // 카테고리 버튼 목록 구성
  let categoryButtons = [];
  if (!currentCategory1) {
    // 1depth 목록
    Object.keys(categories).forEach((cat1) => {
      categoryButtons.push(
        `<button data-category1="${cat1}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">${cat1}</button>`,
      );
    });
  } else if (!currentCategory2) {
    // 2depth 목록
    const second = categories[currentCategory1] || {};
    Object.keys(second).forEach((cat2) => {
      categoryButtons.push(
        `<button data-category1="${currentCategory1}" data-category2="${cat2}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">${cat2}</button>`,
      );
    });
  }
  const categoryButtonsHtml = categoryButtons.join("");

  return `
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
    <!-- 검색창 -->
    <div class="mb-4">
      <div class="relative">
        <input
          type="text"
          id="search-input"
          placeholder="상품명을 검색해보세요..."
          value="${currentSearch}"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button id="search-btn" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
          검색
        </button>
      </div>
    </div>

    <!-- 필터 옵션 -->
    <div class="space-y-3">
      <!-- 카테고리 필터 -->
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">카테고리:</label>
          ${breadcrumbHtml}
        </div>
        <div class="space-y-2">
          <div class="flex flex-wrap gap-2">
            ${categoryButtonsHtml}
          </div>
        </div>
      </div>

      <!-- 페이지당 상품 수 & 정렬 -->
      <div class="flex gap-2 items-center justify-between">
        ${Select({
          id: "limit-select",
          label: "개수",
          options: [
            { value: "10", label: "10개" },
            { value: "20", label: "20개" },
            { value: "50", label: "50개" },
            { value: "100", label: "100개" },
          ],
          value: currentLimit,
        })}
        ${Select({
          id: "sort-select",
          label: "정렬",
          options: [
            { value: "price_asc", label: "가격 낮은순" },
            { value: "popularity", label: "인기순" },
            { value: "price_desc", label: "가격 높은순" },
            { value: "name_asc", label: "이름순" },
            { value: "name_desc", label: "이름 역순" },
          ],
          value: currentSort,
        })}
      </div>
    </div>
  </div>
`;
};
