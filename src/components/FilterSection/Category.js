export const Category = (categories = {}, category1 = "", category2 = "", isLoading) => {
  const renderBreadcrumb = () => {
    let breadcrumb = /* HTML */ `<button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">
      전체
    </button>`;

    if (category1) {
      breadcrumb += `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1="${category1}" class="text-xs hover:text-blue-800 hover:underline">${category1}</button>`;
    }

    if (category2) {
      breadcrumb += `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1="${category2}" class="text-xs hover:text-blue-800 hover:underline">${category2}</button>`;
    }

    return breadcrumb;
  };

  const renderCategories = () => {
    if (isLoading) return `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`;

    if (category1) {
      const subCategories = Object.keys(categories[category1]);

      return subCategories
        .map(
          (category) =>
            /* HTML */ `<button
              data-category1="${category1}"
              data-category2="${category2}"
              class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-blue-100 ${category ===
              category2
                ? "border-blue-300 text-blue-800"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}"
            >
              ${category2}
            </button>`,
        )
        .join("");
    } else {
      const mainCategories = Object.keys(categories);

      return mainCategories
        .map(
          (category) =>
            /* HTML */ `<button
              data-category1="${category}"
              class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              ${category}
            </button>`,
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
      <div class="space-y-2">
        <div class="flex flex-wrap gap-2">${renderCategories()}</div>
      </div>
    </div>
  `;
};
