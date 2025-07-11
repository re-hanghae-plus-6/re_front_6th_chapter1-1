import { getMainState } from "../../pages/MainPage/MainPage";

export const CategoryItem = ({ category, depth }) => {
  const mainState = getMainState();

  return /* HTML */ `
    ${depth === 1
      ? /* HTML */ `
          <button
            data-category1="${category}"
            class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ${category}
          </button>
        `
      : /* HTML */ `
          <button
            data-category1="${mainState.category1}"
            data-category2="${category}"
            class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors ${mainState.category2 ===
            category
              ? "bg-blue-100 border-blue-300 text-blue-800"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}"
          >
            ${category}
          </button>
        `}
  `;
};
