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
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">개수:</label>
          <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <option value="10"${currentLimit === 10 ? " selected" : ""}>10개</option>
            <option value="20"${currentLimit === 20 ? " selected" : ""}>20개</option>
            <option value="50"${currentLimit === 50 ? " selected" : ""}>50개</option>
            <option value="100"${currentLimit === 100 ? " selected" : ""}>100개</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">정렬:</label>
          <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <option value="price_asc"${currentSort === "price_asc" ? " selected" : ""}>가격 낮은순</option>
            <option value="popularity"${currentSort === "popularity" ? " selected" : ""}>인기순</option>
            <option value="price_desc"${currentSort === "price_desc" ? " selected" : ""}>가격 높은순</option>
            <option value="name_asc"${currentSort === "name_asc" ? " selected" : ""}>이름순</option>
            <option value="name_desc"${currentSort === "name_desc" ? " selected" : ""}>이름 역순</option>
          </select>
        </div>
      </div>
    </div>
  </div>
`;
};
