// export class SortFilter {
//   constructor(container) {
//     this.container = container;
//     this.limit = 20;
//     this.sort = "price_asc";
//     this.onFilterChange = null;
//   }

//   async init(limit = 20, sort = "price_asc", onFilterChange = null) {
//     this.limit = limit;
//     this.sort = sort;
//     this.onFilterChange = onFilterChange;

//     this.render();
//     this.setupEventListeners();
//   }

//   render() {
//     this.container.innerHTML = `
//       <div class="flex gap-2 items-center justify-between">
//         <!-- 페이지당 상품 수 -->
//         <div class="flex items-center gap-2">
//           <label class="text-sm text-gray-600">개수:</label>
//           <select id="limit-select"
//                   class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
//             <option value="10" ${this.limit === 10 ? "selected" : ""}>10개</option>
//             <option value="20" ${this.limit === 20 ? "selected" : ""}>20개</option>
//             <option value="50" ${this.limit === 50 ? "selected" : ""}>50개</option>
//             <option value="100" ${this.limit === 100 ? "selected" : ""}>100개</option>
//           </select>
//         </div>

//         <!-- 정렬 -->
//         <div class="flex items-center gap-2">
//           <label class="text-sm text-gray-600">정렬:</label>
//           <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
//                        focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
//             <option value="price_asc" ${this.sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
//             <option value="price_desc" ${this.sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
//             <option value="name_asc" ${this.sort === "name_asc" ? "selected" : ""}>이름순</option>
//             <option value="name_desc" ${this.sort === "name_desc" ? "selected" : ""}>이름 역순</option>
//           </select>
//         </div>
//       </div>
//     `;
//   }

//   setupEventListeners() {
//     const limitSelect = this.container.querySelector("#limit-select");
//     if (limitSelect) {
//       limitSelect.addEventListener("change", (e) => {
//         const selectedLimit = parseInt(e.target.value);
//         this.limit = selectedLimit;
//         this.onFilterChange?.({ limit: selectedLimit });
//       });
//     }

//     const sortSelect = this.container.querySelector("#sort-select");
//     if (sortSelect) {
//       sortSelect.addEventListener("change", (e) => {
//         const selectedSort = e.target.value;
//         this.sort = selectedSort;
//         this.onFilterChange?.({ sort: selectedSort });
//       });
//     }
//   }

//   updateValues(limit, sort) {
//     this.limit = limit;
//     this.sort = sort;
//     this.render();
//     this.setupEventListeners();
//   }

//   destroy() {}
// }

export const SortFilter = (limit, sort) => {
  return /* html */ `
      <div class="flex gap-2 items-center justify-between">
        <!-- 페이지당 상품 수 -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">개수:</label>
          <select id="limit-select"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <option value="10" ${limit === "10" ? "selected" : ""}>10개</option>
            <option value="20" ${limit === "20" ? "selected" : ""}>20개</option>
            <option value="50" ${limit === "50" ? "selected" : ""}>50개</option>
            <option value="100" ${limit === "100" ? "selected" : ""}>100개</option>
          </select>
        </div>
        
        <!-- 정렬 -->
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
      </div>
    `;
};
