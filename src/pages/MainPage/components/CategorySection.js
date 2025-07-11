import { CategoryLoader } from "../../../features/category/CategoryLoader";
import { CategoryItem } from "../../../features/category/CateogryItem";
import { getMainState } from "../MainPage";

export const CategorySection = () => {
  const mainState = getMainState();

  return /* HTML */ `
    <div class="flex items-center gap-2">
      <label class="text-sm text-gray-600">카테고리:</label>
      <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
      ${mainState.category1
        ? /* HTML */ `
            <span class="text-xs text-gray-500">&gt;</span
            ><button
              data-breadcrumb="category1"
              data-category1="${mainState.category1}"
              class="text-xs hover:text-blue-800 hover:underline"
            >
              ${mainState.category1}
            </button>
          `
        : ""}
      ${mainState.category2
        ? /* HTML */ `
            <span class="text-xs text-gray-500">&gt;</span
            ><span class="text-xs text-gray-600 cursor-default">${mainState.category2}</span>
          `
        : ""}
    </div>
    <div class="flex flex-wrap gap-2">
      ${mainState.isLoading
        ? CategoryLoader()
        : Object.keys(mainState.category1.trim() ? mainState.categories[mainState.category1] : mainState.categories)
            .map((category) => CategoryItem({ category, depth: mainState.category1 ? 2 : 1 }))
            .join("")}
    </div>
  `;
};
