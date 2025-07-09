const limitOptions = [10, 20, 50, 100];
const sortOptions = [
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "name_asc", label: "이름순" },
  { value: "name_desc", label: "이름 역순" },
];

export default function ProductFilter({ state }) {
  const categories = state.categories;
  const category1List = categories ? Object.keys(categories) : [];
  const category2List = categories?.[state.category1] ? Object.keys(categories[state.category1]) : [];

  return /*html*/ `
 <!-- 검색 및 필터 -->
 <div id="product-filter" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
 <!-- 검색창 -->
 <div class="mb-4">
   <div class="relative">
     <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${state.search || ""}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
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
       <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline ${!state.category1 && !state.category2 ? "text-blue-600 font-medium" : ""}">전체</button>
       ${state.category1 ? `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1="${state.category1}" class="text-xs hover:text-blue-800 hover:underline">${state.category1}</button>` : ""}
       ${state.category2 ? `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category2" data-category2="${state.category2}" class="text-xs hover:text-blue-800 hover:underline">${state.category2}</button>` : ""}
     </div>
     <!-- 1depth 카테고리 -->
     ${
       !categories
         ? `
      <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
    `
         : !state.category1
           ? `
     <div class="flex flex-wrap gap-2">
     ${category1List
       .map(
         (category1) => `
      <button data-category1="${category1}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
        bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
        ${category1}
     </button>
     `,
       )
       .join("")}
       </div>
       `
           : `
       <!-- 2depth 카테고리 -->
       <div class="flex flex-wrap gap-2">
        ${category2List
          .map(
            (category2) => `
          <button data-category2="${category2}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
            ${state.category2 === category2 ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
            ${category2}
          </button>
          `,
          )
          .join("")}
          </div>
      `
     }
   </div>
   <!-- 기존 필터들 -->
   <div class="flex gap-2 items-center justify-between">
     <!-- 페이지당 상품 수 -->
     <div class="flex items-center gap-2">
       <label class="text-sm text-gray-600">개수:</label>
       <select id="limit-select"
               class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
         ${limitOptions
           .map((limit) => `<option value="${limit}" ${state.limit === limit ? "selected" : ""}>${limit}개</option>`)
           .join("")}
       </select>
     </div>
     <!-- 정렬 -->
     <div class="flex items-center gap-2">
       <label class="text-sm text-gray-600">정렬:</label>
       <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                    focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
         ${sortOptions
           .map(
             (option) =>
               `<option value="${option.value}" ${state.sort === option.value ? "selected" : ""}>${option.label}</option>`,
           )
           .join("")}
       </select>
     </div>
   </div>
 </div>
</div>
  `;
}
