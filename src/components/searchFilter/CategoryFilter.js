import { categoriesStore } from "../../store";

import { CategoryItem } from "./CategoryItem";

export const CategoryFilter = () => {
  const params = new URLSearchParams(window.location.search);
  const selectedCategory1 = params.get("category1") || "";
  const selectedCategory2 = params.get("category2") || "";
  const { categories, isLoading } = categoriesStore.state;
  console.log(categories);
  const category1 = Object.keys(categories) ?? [];

  let category2 = [];
  if (selectedCategory1 && categories[selectedCategory1]) {
    category2 = Object.keys(categories[selectedCategory1]) || [];
  }

  let breadcrumbHtml = "";

  if (selectedCategory1) {
    breadcrumbHtml += /* HTML */ `
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
    breadcrumbHtml += /* HTML */ `
      <span class="text-xs text-gray-500">&gt;</span>
      <button
        data-breadcrumb="category2"
        data-category2="${selectedCategory2}"
        class="text-xs hover:text-blue-800 hover:underline"
      >
        ${selectedCategory2}
      </button>
    `;
  }

  return /* HTML */ `
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
        ${breadcrumbHtml}
      </div>
      <!-- 1depth 카테고리 -->
      <div class="flex flex-wrap gap-2">
        ${isLoading
          ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
          : selectedCategory1 === ""
            ? category1.map((category) => CategoryItem(category)).join("")
            : category2
                .map((category) => CategoryItem(selectedCategory1, category, selectedCategory2 === category))
                .join("")}
      </div>
      <!-- 2depth 카테고리 -->
    </div>
  `;
};
