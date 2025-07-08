export class SearchFilter {
  constructor(container) {
    this.container = container;
    this.searchQuery = "";
    this.limit = 20;
    this.sort = "price_asc";
    this.onFilterChange = null;
  }

  async init(searchQuery = "", limit = 20, sort = "price_asc", onFilterChange = null) {
    this.searchQuery = searchQuery;
    this.limit = limit;
    this.sort = sort;
    this.onFilterChange = onFilterChange;

    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="space-y-3">
        <!-- 검색창 -->
        <div class="mb-4">
          <div class="relative">
            <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${this.searchQuery}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- 필터 옵션 -->
        <div class="flex gap-2 items-center justify-between">
          <!-- 페이지당 상품 수 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">개수:</label>
            <select id="limit-select"
                    class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="10" ${this.limit === 10 ? "selected" : ""}>10개</option>
              <option value="20" ${this.limit === 20 ? "selected" : ""}>20개</option>
              <option value="50" ${this.limit === 50 ? "selected" : ""}>50개</option>
              <option value="100" ${this.limit === 100 ? "selected" : ""}>100개</option>
            </select>
          </div>
          
          <!-- 정렬 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">정렬:</label>
            <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                         focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="price_asc" ${this.sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
              <option value="price_desc" ${this.sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
              <option value="name_asc" ${this.sort === "name_asc" ? "selected" : ""}>이름순</option>
              <option value="name_desc" ${this.sort === "name_desc" ? "selected" : ""}>이름 역순</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const searchInput = this.container.querySelector("#search-input");
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const searchValue = e.target.value.trim();
          this.searchQuery = searchValue;
          this.onFilterChange?.({ search: searchValue });
        }
      });
    }

    const limitSelect = this.container.querySelector("#limit-select");
    if (limitSelect) {
      limitSelect.addEventListener("change", (e) => {
        const selectedLimit = parseInt(e.target.value);
        this.limit = selectedLimit;
        this.onFilterChange?.({ limit: selectedLimit });
      });
    }

    const sortSelect = this.container.querySelector("#sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        const selectedSort = e.target.value;
        this.sort = selectedSort;
        this.onFilterChange?.({ sort: selectedSort });
      });
    }
  }

  updateValues(searchQuery, limit, sort) {
    this.searchQuery = searchQuery;
    this.limit = limit;
    this.sort = sort;
    this.render();
    this.setupEventListeners();
  }

  destroy() {}
}
