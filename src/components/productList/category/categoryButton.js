export const CategoryButton = ({ category1, category2, name = "", isSelected = false }) => `
    <button data-category1="${category1}" data-category2="${category2}" class="${category2 || category1}-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors ${isSelected ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"} ">
        ${name}
    </button>
`;
