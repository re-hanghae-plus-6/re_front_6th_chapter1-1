export function renderCategoryFilterHTML(isFirstLoad, selectedCategory, categories) {
  const category1 = selectedCategory.category1;
  const category2 = selectedCategory.category2;

  const breadcrumb = `
    <div class="flex items-center gap-2">
      <label class="text-sm text-gray-600">카테고리:</label>
      <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
      ${
        category1
          ? `<span class="text-xs text-gray-500">&gt;</span>
        <button data-breadcrumb="category1" data-category1="${category1}" class="text-xs hover:text-blue-800 hover:underline">${category1}</button>`
          : ""
      }
      ${
        category2
          ? `<span class="text-xs text-gray-500">&gt;</span>
        <span class="text-xs text-gray-600 cursor-default">${category2}</span>`
          : ""
      }
    </div>
  `;

  const category1Buttons = !category1
    ? `
    <div class="flex flex-wrap gap-2">
      ${Object.keys(categories)
        .map(
          (cat1) => `
          <button data-category1="${cat1}" class="category1-filter-btn px-3 py-2 text-sm rounded-md border
            bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
            ${cat1}
          </button>
        `,
        )
        .join("")}
    </div>
  `
    : "";

  const category2Buttons =
    category1 && categories[category1]
      ? `
      <div class="flex flex-wrap gap-2">
        ${Object.keys(categories[category1])
          .map(
            (cat2) => `
              <button data-category1="${category1}" data-category2="${cat2}" class="category2-filter-btn px-3 py-2 text-sm rounded-md border
                ${cat2 === category2 ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
                ${cat2}
              </button>
            `,
          )
          .join("")}
      </div>
    `
      : "";

  return `
    <div class="space-y-2">
      ${breadcrumb}
      ${isFirstLoad ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>` : category1Buttons}
      ${category2Buttons ? `<div class="space-y-2">${category2Buttons}</div>` : ""}
    </div>
  `;
}
