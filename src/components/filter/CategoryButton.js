export const category1DepthButton = (categories) => {
  return Object.keys(categories)
    .map((category1) => {
      return `
          <button
            data-category1="${category1}"
            class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
              bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ${category1}
          </button>
        `;
    })
    .join("");
};

export const category2DepthButton = (categories, selectedCategory1, selectedCategory2) => {
  return categories[selectedCategory1]
    .map((category2) => {
      const isSelected = category2 === selectedCategory2;
      const base = "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors";
      const selected = "bg-blue-100 border-blue-300 text-blue-800";
      const normal = "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";

      return `
          <button
            data-category1="${selectedCategory1}"
            data-category2="${category2}"
            class="${base} ${isSelected ? selected : normal}"
          >
            ${category2}
          </button>
        `;
    })
    .join("");
};
