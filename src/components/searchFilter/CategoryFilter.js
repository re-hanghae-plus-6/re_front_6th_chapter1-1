import { categoriesStore } from "../../store";
import { CategoryItem } from "./CategoryItem";

export const CategoryFilter = () => {
  const { categories, isLoading } = categoriesStore.state;
  console.log("categories", categories);
  const category1 = Object.keys(categories) ?? [];
  console.log("category1", category1);
  return /* HTML */ `
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
      </div>
      <!-- 1depth 카테고리 -->
      <div class="flex flex-wrap gap-2">
        ${isLoading
          ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
          : category1.map((category) => CategoryItem(category)).join("")}
      </div>
      <!-- 2depth 카테고리 -->
    </div>
  `;
};
