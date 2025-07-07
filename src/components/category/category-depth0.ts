import type { Categories } from "./index.ts";

export const 상품목록_레이아웃_카테고리_0Depth = (categories: Categories): string => {
  const buttons = Object.keys(categories)
    .map(
      (cat1) => `
      <button data-category1="${cat1}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
        ${cat1}
      </button>`,
    )
    .join("");

  return `
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
      </div>
      <div class="flex flex-wrap gap-2">
        ${buttons}
      </div>
    </div>
  `;
};
