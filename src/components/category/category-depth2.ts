export const 상품목록_레이아웃_카테고리_2Depth = (
  category1: string,
  category2: string,
  category2Map: Record<string, unknown>,
): string => {
  const buttons = Object.keys(category2Map)
    .map((cat2) => {
      const isActive = cat2 === category2;
      const baseClass = "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors";
      const style = isActive
        ? "bg-blue-100 border-blue-300 text-blue-800"
        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
      return `<button data-category1="${category1}" data-category2="${cat2}" class="${baseClass} ${style}">
        ${cat2}
      </button>`;
    })
    .join("");

  return `
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
        <span class="text-xs text-gray-500">&gt;</span>
        <button data-breadcrumb="category1" data-category1="${category1}" class="text-xs hover:text-blue-800 hover:underline">${category1}</button>
        <span class="text-xs text-gray-500">&gt;</span>
        <span class="text-xs text-gray-600 cursor-default">${category2}</span>
      </div>
      <div class="space-y-2">
        <div class="flex flex-wrap gap-2">
          ${buttons}
        </div>
      </div>
    </div>
  `;
};
