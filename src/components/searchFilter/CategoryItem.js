export const CategoryItem = (category) => {
  return /* HTML */ `
    <button
      data-category1="${category}"
      class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
    >
      ${category}
    </button>
  `;
};
