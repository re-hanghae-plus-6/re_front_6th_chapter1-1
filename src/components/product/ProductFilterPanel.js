import { productState } from "../../core/productState";

export function ProductFilterPanel() {
  if (productState.loadingCategories) {
    return /*html*/ `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div class="space-y-2">
          <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
        </div>
      </div>
    `;
  }

  // 카테고리 1Depth 버튼 목록
  const cat1Buttons = productState.categories
    .map(
      (c) => /*html*/ `
        <button
          data-category1="${c.name}"
          class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                 ${productState.filters.category1 === c.name ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}">
          ${c.name}
        </button>`,
    )
    .join("");

  // 선택된 1Depth 가 있을 때 2Depth 렌더
  let cat2Block = "";
  if (productState.filters.category1) {
    const cat2Arr = productState.categories.find((c) => c.name === productState.filters.category1)?.children || [];
    cat2Block = /*html*/ `
      <div class="space-y-2">
        <div class="flex flex-wrap gap-2">
          ${cat2Arr
            .map(
              (c) => /*html*/ `
              <button
                data-category1="${productState.filters.category1}"
                data-category2="${c}"
                class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                       ${productState.filters.category2 === c ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}">
                ${c}
              </button>`,
            )
            .join("")}
        </div>
      </div>`;
  }

  return /*html*/ `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <!-- 검색창 -->
      <div class="mb-4">
        <div class="relative">
          <input
            type="text"
            id="search-input"
            placeholder="상품명을 검색해보세요..."
            value="${productState.filters.search}"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
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
        <!-- 카테고리 Filers -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">카테고리:</label>
            <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
          </div>
          <!-- 1Depth -->
          <div class="flex flex-wrap gap-2">
            ${cat1Buttons}
          </div>
          <!-- 2Depth -->
          ${cat2Block}
        </div>

        <!-- 페이지당 개수 · 정렬 -->
        <div class="flex gap-2 items-center justify-between">
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">개수:</label>
            <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1">
              ${[10, 20, 50, 100]
                .map(
                  (n) => `<option value="${n}" ${productState.filters.limit === n ? "selected" : ""}>${n}개</option>`,
                )
                .join("")}
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">정렬:</label>
            <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1">
              <option value="price_asc"  ${
                productState.filters.sort === "price_asc" ? "selected" : ""
              }>가격 낮은순</option>
              <option value="price_desc" ${
                productState.filters.sort === "price_desc" ? "selected" : ""
              }>가격 높은순</option>
              <option value="name_asc"   ${productState.filters.sort === "name_asc" ? "selected" : ""}>이름순</option>
              <option value="name_desc"  ${
                productState.filters.sort === "name_desc" ? "selected" : ""
              }>이름 역순</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
}
