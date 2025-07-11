export const CategoryItem = (category1, category2, selected) => {
  if (!category2) {
    return /* HTML */ `
      <button
        data-category1="${category1}"
        class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        ${category1}
      </button>
    `;
  }

  return /* HTML */ `
    <button
      data-category1="${category1}"
      data-category2="${category2}"
      class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors ${
        selected ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700"
      } "hover:bg-gray-50"
    >
      ${category2}
    </button>
  `;
};
