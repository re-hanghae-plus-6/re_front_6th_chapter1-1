export default function CategoryItem({ category }) {
  return /* HTML */ `<button
    data-category=${category}
    class="category-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
  >
    ${category}
  </button>`;
}
