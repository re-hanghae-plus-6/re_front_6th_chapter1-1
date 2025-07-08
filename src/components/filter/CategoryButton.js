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

export const category2DepthButton = (categories, category1, category2) => {
  return Object.keys(categories[category1])
    .map((category2Depth) => {
      const isSelected = category2 === category2Depth;
      const base = "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors";
      const selected = "bg-blue-100 border-blue-300 text-blue-800";
      const normal = "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";

      return `
          <button
            data-category1="${category1}"
            data-category2="${category2Depth}"
            class="${base} ${isSelected ? selected : normal}"
          >
            ${category2Depth}
          </button>
        `;
    })
    .join("");
};
