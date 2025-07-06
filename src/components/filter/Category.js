export default function Category({
  categories = [],
  selectedCategory1 = "",
  selectedCategory2 = "",
  isLoading = false,
}) {
  const renderBreadcrumb = () => {
    let breadcrumb = /* HTML */ `
      <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
    `;

    if (selectedCategory1) {
      breadcrumb += /* HTML */ `
        <span class="text-xs text-gray-500">&gt;</span>
        <button
          data-breadcrumb="category1"
          data-category1="${selectedCategory1}"
          class="text-xs hover:text-blue-800 hover:underline"
        >
          ${selectedCategory1}
        </button>
      `;
    }

    if (selectedCategory2) {
      breadcrumb += /* HTML */ `
        <span class="text-xs text-gray-500">&gt;</span>
        <span class="text-xs text-gray-600 cursor-default">${selectedCategory2}</span>
      `;
    }

    return breadcrumb;
  };

  const renderCategoryButtons = () => {
    if (isLoading) {
      return /* HTML */ ` <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div> `;
    }

    if (!selectedCategory1) {
      // 1depth 카테고리 표시 - categories가 객체일 수도 있음
      const categoryList = Array.isArray(categories) ? categories : Object.keys(categories || {});
      return categoryList
        .map(
          (category) => /* HTML */ `
            <button
              data-category1="${category}"
              class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
           ${selectedCategory1 === category
                ? "bg-blue-100 border-blue-300 text-blue-800"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}"
            >
              ${category}
            </button>
          `,
        )
        .join("");
    } else {
      // 2depth 카테고리 표시
      const subCategories = categories[selectedCategory1] ? Object.keys(categories[selectedCategory1]) : [];
      return subCategories
        .map(
          (category) => /* HTML */ `
            <button
              data-category1="${selectedCategory1}"
              data-category2="${category}"
              class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
           ${selectedCategory2 === category
                ? "bg-blue-100 border-blue-300 text-blue-800"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}"
            >
              ${category}
            </button>
          `,
        )
        .join("");
    }
  };

  return /* HTML */ `
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        ${renderBreadcrumb()}
      </div>
      <div class="flex flex-wrap gap-2">${renderCategoryButtons()}</div>
    </div>
  `;
}
