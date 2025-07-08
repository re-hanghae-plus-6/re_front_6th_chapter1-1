function Tab() {
  const TabMenuList = [
    { name: "전체", value: "all" },
    { name: "생활/건강", value: "생활/건강" },
    { name: "디지털/가전", value: "디지털/가전" },
  ];

  return /* HTML */ `
    <div class="space-y-3">
      <!-- 카테고리 필터 -->
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">카테고리:</label>
          <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
        </div>
        <!-- 1depth 카테고리 -->
        <div class="flex flex-wrap gap-2">
          ${TabMenuList.map(
            (menu) =>
              `<button
                data-category1="${menu.value}"
                class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                ${menu.name}
              </button>
            `,
          ).join("")}
        </div>
        <!-- 2depth 카테고리 -->
      </div>
    </div>
  `;
}

export default Tab;
