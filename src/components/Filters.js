export const CategoryButton = (category) => {
  return `
         <button data-category1="${category}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  ${category}
                </button>
      `;
};

export const SubCategoryButton = (category) => {
  return `
        <button data-category2="${category}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  ${category}
                </button>
      `;
};

export const ProductCountPerPage = ({ productCount }) => {
  return `<div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">개수:</label>
              <select id="limit-select"
                      class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="10" ${productCount === 10 ? "selected" : ""}>
                  10개
                </option>
                <option value="20" ${productCount === 20 ? "selected" : ""}>
                  20개
                </option>
                <option value="50" ${productCount === 50 ? "selected" : ""}>
                  50개
                </option>
                <option value="100" ${productCount === 100 ? "selected" : ""}>
                  100개
                </option>
              </select>
            </div>
    
    `;
};

export const ProductArrange = ({ sort }) => {
  return `
  
              <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">정렬:</label>
              <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                           focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="price_asc" ${sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
                <option value="price_desc" ${sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
                <option value="name_asc" ${sort === "name_asc" ? "selected" : ""}>이름순</option>
                <option value="name_desc" ${sort === "name_desc" ? "selected" : ""}>이름 역순</option>
              </select>
            </div>
    
    `;
};
