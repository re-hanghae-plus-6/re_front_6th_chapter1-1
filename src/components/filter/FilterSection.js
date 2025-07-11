export default function FilterSection({
  searchValue = "",
  categories = [],
  selectedCategory1 = "",
  selectedCategory2 = "",
  sort = "price_asc",
  limit = 20,
  loading = false,
}) {
  console.log("FS sort => ", sort);
  // 브레드크럼(breadcrumb) 영역 렌더링
  // 1depth, 2depth 카테고리 선택에 따라 동적으로 표시
  const renderBreadcrumb = () => {
    let breadcrumb = "";

    const pathname = window.location.pathname;
    if (pathname.includes("category1")) {
      const match = pathname.match(/category1=([^&/]+)/)[1];
      selectedCategory1 = decodeURIComponent(match);
    }
    if (pathname.includes("category2")) {
      const match = pathname.match(/category2=([^&/]+)/)[1];
      selectedCategory2 = decodeURIComponent(match);
    }
    // 항상 '전체'에서 시작
    breadcrumb += `<button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>`;
    if (selectedCategory1) {
      breadcrumb += `<span class="mx-1 text-gray-400">></span>`;
      breadcrumb += `<button data-breadcrumb="category1" class="text-xs hover:text-blue-800 hover:underline">${selectedCategory1}</button>`;
    }
    if (selectedCategory2) {
      breadcrumb += `<span class="mx-1 text-gray-400">></span>`;
      breadcrumb += `<button data-breadcrumb="category2" class="text-xs hover:text-blue-800 hover:underline">${selectedCategory2}</button>`;
    }
    return breadcrumb;
  };

  // 카테고리 버튼 렌더링
  const renderCategoryButtons = () => {
    if (loading) {
      return `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`;
    }
    const pathname = window.location.pathname;

    if (!selectedCategory1) {
      // 1depth 카테고리 표시
      const categoryList = Array.isArray(categories) ? categories : Object.keys(categories || {});

      return categoryList
        .map(
          (category) => `
            <button
              data-category1="${category}"
              class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              ${category}
            </button>
          `,
        )
        .join("");
    } else {
      // 2depth 카테고리 표시
      if (pathname.includes("category1")) {
        const cate1 = pathname.match(/category1=([^&/]+)/)[1];
        selectedCategory1 = decodeURIComponent(cate1);
      }

      if (pathname.includes("category2")) {
        const cate2 = pathname.match(/category2=([^&/]+)/)[1];
        selectedCategory2 = decodeURIComponent(cate2);
      }

      const subCategories = categories[selectedCategory1] ? Object.keys(categories[selectedCategory1]) : [];

      return subCategories
        .map(
          (category) => `
            <button
              data-category1="${selectedCategory1}"
              data-category2="${category}"
              class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                ${
                  selectedCategory2 === category
                    ? "bg-blue-100 border-blue-300 text-blue-800"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }"
            >
              ${category}
            </button>
          `,
        )
        .join("");
    }
  };
  const pathname = window.location.pathname;
  if (pathname.includes("limit")) {
    const match = pathname.match(/limit=([^&/]+)/)[1];
    limit = decodeURIComponent(match);
  }

  if (pathname.includes("sort")) {
    const match = pathname.match(/sort=([^&/]+)/)[1];
    sort = decodeURIComponent(match);
  }

  if (pathname.includes("search")) {
    const match = pathname.match(/search=([^&/]+)/)[1];
    searchValue = decodeURIComponent(match);
  }
  // 정렬 옵션
  const sortOptions = [
    { value: "price_asc", label: "가격 낮은순" },
    { value: "price_desc", label: "가격 높은순" },
    { value: "name_asc", label: "이름순" },
    { value: "name_desc", label: "이름 역순" },
  ];

  // 개수 옵션
  const limitOptions = [
    { value: "10", label: "10개" },
    { value: "20", label: "20개" },
    { value: "50", label: "50개" },
    { value: "100", label: "100개" },
  ];

  return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
            <div class="relative">
            <input 
                type="text" 
                id="search-input" 
                placeholder="상품명을 검색해보세요..." 
                value="${searchValue}" 
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
                <div class="flex flex-wrap gap-2">${renderCategoryButtons()}</div>
            </div>

            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select 
                    id="limit-select"
                    class="text-sm border border-gray-300 rounded px-2 py-1 
                           focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                ${limitOptions
                  .map(
                    (option) => `
                    <option value="${option.value}" ${limit === option.value ? "selected" : ""}>
                        ${option.label}
                    </option>
                    `,
                  )
                  .join("")}
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
                ${sortOptions
                  .map(
                    (option) => `
                    <option value="${option.value}" ${sort === option.value ? "selected" : ""}>
                    ${option.label}
                    </option>
                `,
                  )
                  .join("")}
                </select>
            </div>
            </div>
        </div>
        </div>
    `;
}
