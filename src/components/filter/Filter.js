const limitOptions = [
  { value: "10", label: "10개" },
  { value: "20", label: "20개" },
  { value: "50", label: "50개" },
  { value: "100", label: "100개" },
];

const sortOptions = [
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "name_asc", label: "이름순" },
  { value: "name_desc", label: "이름 역순" },
];

export const Filter = ({ isLoading, categories = {}, search, selectedLimit, selectedSort }) => {
  const params = new URLSearchParams(window.location.search);
  const selectedCategory1 = params.get("category1");
  const selectedCategory2 = params.get("category2");

  const renderBreadcrumbs = () => {
    const crumbs = [
      `<button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>`,
    ];
    if (selectedCategory1) {
      crumbs.push(`<span class="text-xs text-gray-500">&gt;</span>
                   <button data-breadcrumb="category1" data-category1="${selectedCategory1}" class="text-xs hover:text-blue-800 hover:underline">${selectedCategory1}</button>`);
    }
    if (selectedCategory2) {
      crumbs.push(`<span class="text-xs text-gray-500">&gt;</span>
                   <button data-breadcrumb="category2" data-category2="${selectedCategory2}" class="text-xs hover:text-blue-800 hover:underline">${selectedCategory2}</button>`);
    }
    return crumbs.join("");
  };

  const renderCategoryButtons = () => {
    if (isLoading && Object.keys(categories).length === 0) {
      return `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`;
    }
    if (selectedCategory1) {
      return Object.keys(categories[selectedCategory1])
        .map(
          (category2) =>
            `<button data-category2="${category2}" class="category2-filter-btn ${categoryButtonStyle}">${category2}</button>`,
        )
        .join("");
    }
    return Object.keys(categories)
      .map(
        (category1) =>
          `<button data-category1="${category1}" class="category1-filter-btn ${categoryButtonStyle}">${category1}</button>`,
      )
      .join("");
  };

  const categoryButtonStyle = `text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50`;

  return `
    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div class="mb-4 relative">
        <input type="text" id="search-input" value="${search}" placeholder="상품명을 검색해보세요..." 
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <!-- 카테고리 필터 -->
      <div class="space-y-2 mb-3">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">카테고리:</label>
          ${renderBreadcrumbs()}
        </div>
        <div class="flex flex-wrap gap-2">
          ${renderCategoryButtons()}
        </div>
      </div>

      <!-- 개수 및 정렬 -->
      <div class="flex gap-2 items-center justify-between">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">개수:</label>
          <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
           ${limitOptions
             .map(
               (option) => `
                  <option value="${option.value}" ${selectedLimit === option.value ? "selected" : ""}>
                    ${option.label}
                  </option>
                `,
             )
             .join("")}
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">정렬:</label>
          <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                 ${sortOptions
                   .map(
                     (option) => `
                  <option value="${option.value}" ${selectedSort === option.value ? "selected" : ""}>
                    ${option.label}
                  </option>
                `,
                   )
                   .join("")}
          </select>
        </div>
      </div>
    </section>
  `;
};
