import { getProductParams } from "../pages/Main";

const Filter = ({ isLoading, categoriesData }) => {
  const { limit, sort, search } = getProductParams();
  const selectedLimit = limit ?? "20";
  const selectedSort = sort ?? "price_asc";
  const inputedSearch = search ?? "";

  return `
    <!-- 검색 및 필터 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <!-- 검색창 --> 
      <div class="mb-4">
        <div class="relative">
          <input
            type="text"
            id="search-input"
            placeholder="상품명을 검색해보세요..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value=${inputedSearch}
          >
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
        ${Category(isLoading, categoriesData)}
        <!-- 기존 필터들 --> 
        <div class="flex gap-2 items-center justify-between">
          <!-- 페이지당 상품 수 --> 
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">개수:</label>
            <select
              id="limit-select"
              class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10" ${selectedLimit === "10" ? "selected" : ""}>10개</option>
              <option value="20" ${selectedLimit === "20" ? "selected" : ""}>20개</option>
              <option value="50" ${selectedLimit === "50" ? "selected" : ""}>50개</option>
              <option value="100" ${selectedLimit === "100" ? "selected" : ""}>100개</option>
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
              <option value="price_asc" ${selectedSort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
              <option value="price_desc" ${selectedSort === "price_desc" ? "selected" : ""}>가격 높은순</option>
              <option value="name_asc" ${selectedSort === "name_asc" ? "selected" : ""}>이름순</option>
              <option value="name_desc" ${selectedSort === "name_desc" ? "selected" : ""}>이름 역순</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
};

const Category = (isLoading, data) => {
  const { category1, category2 } = getProductParams();

  // const selectedCategory1 = category1 ?? "";

  // const oneDepth = data ? Object.keys(data) : [];
  // const twoDepth = data?.[selectedCategory1] ? Object.keys(data?.[selectedCategory1]) : [];

  return `
    <div id="category-select" class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
        ${category1 ? `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1=${category1} class="text-xs hover:text-blue-800 hover:underline">${category1}</button>` : ""}
        ${category2 ? `<span class="text-xs text-gray-500">&gt;</span><span class="text-xs text-gray-600 cursor-default">${category2}</span>` : ""}
      </div>

      <div class="flex flex-wrap gap-2">
        ${CategoryButtons(isLoading, data)}
      </div>
    </div>
  `;
};

const CategoryButtons = (isLoading, data) => {
  const { category1 } = getProductParams();

  const selectedCategory1 = category1 ?? "";

  const oneDepth = data ? Object.keys(data) : [];
  const twoDepth = data?.[selectedCategory1] ? Object.keys(data?.[selectedCategory1]) : [];

  if (isLoading) {
    return `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`;
  }

  return twoDepth.length === 0
    ? oneDepth?.map((category1) => Category1Button(category1)).join("\n")
    : twoDepth?.map((category2) => Category2Button(selectedCategory1, category2)).join("\n");
};

const Category1Button = (category1) => {
  return `
    <button
      data-category1=${category1}
      class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
    >
      ${category1}
    </button>
  `;
};

const Category2Button = (category1, category2) => {
  return `
    <button
      data-category1=${category1}
      data-category2=${category2}
      class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
    >
      ${category2}
    </button>
  `;
};

export default Filter;
