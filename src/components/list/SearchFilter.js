import { getCategories } from "../../api/productApi.js";

class SearchFilter {
  constructor(onFilterChange) {
    this.el = null;
    this.onFilterChange = onFilterChange;
    this.state = {
      categories: {},
      isLoading: true,
    };

    // Debounce a la gestion des recherches
    this.handleSearch = this.debounce((e) => {
      if (this.onFilterChange) this.onFilterChange({ search: e.target.value });
    }, 300);
  }

  async fetchCategories() {
    this.setState({ isLoading: true });
    try {
      const data = await getCategories();
      this.setState({ categories: data, isLoading: false });
    } catch (error) {
      console.error("카테고리 데이터 로딩 실패:", error);
      this.setState({ isLoading: false });
    }
  }

  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    if (this.el) {
      this.updateContent();
    }
  }

  updateContent() {
    const categoryListHtml = this.state.isLoading
      ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
      : Object.keys(this.state.categories)
          .map((cat) => `<button class="text-sm border px-2 py-1 rounded hover:bg-gray-100">${cat}</button>`)
          .join("");

    const categoryContainer = this.el.querySelector(".flex.flex-wrap.gap-2");
    if (categoryContainer) {
      categoryContainer.innerHTML = categoryListHtml;
    }
  }

  render() {
    if (!this.el) {
      this.el = document.createElement("div");
      this.el.className = "bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4";
      this.el.innerHTML = `
           <!-- 검색창 -->
           <div class="mb-4">
             <div class="relative">
               <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
               <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                 </svg>
               </div>
             </div>
           </div>
   
           <!-- 필터 옵션 -->
           <div class="space-y-3">
             <!-- 카테고리 필터 -->
             <div class="space-y-2">
               <div class="flex items-center gap-2">
                 <label class="text-sm text-gray-600">카테고리:</label>
                 <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
               </div>
               <!-- 1depth 카테고리 (여기에 동적 콘텐츠가 들어갑니다) -->
               <div class="flex flex-wrap gap-2"></div>
             </div>
   
             <!-- 개수/정렬 -->
             <div class="flex gap-2 items-center justify-between">
               <div class="flex items-center gap-2">
                 <label class="text-sm text-gray-600">개수:</label>
                 <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                   <option value="10">10개</option>
                   <option value="20" selected>20개</option>
                   <option value="50">50개</option>
                   <option value="100">100개</option>
                 </select>
               </div>
               <div class="flex items-center gap-2">
                 <label class="text-sm text-gray-600">정렬:</label>
                 <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                   <option value="price_asc" selected>가격 낮은순</option>
                   <option value="price_desc">가격 높은순</option>
                    <option value="name_asc">이름순</option>
                    <option value="name_desc">이름 역순</option>
                  </select>
                </div>
              </div>
            </div>
          `;
    }
    this.updateContent();
    this.addEvent();
    this.fetchCategories();
    return this.el;
  }

  debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  addEvent() {
    const searchInput = this.el.querySelector("#search-input");
    const limitSelect = this.el.querySelector("#limit-select");
    const sortSelect = this.el.querySelector("#sort-select");

    searchInput?.addEventListener("input", this.handleSearch);

    limitSelect?.addEventListener("change", (e) => {
      if (this.onFilterChange) this.onFilterChange({ limit: e.target.value });
    });

    sortSelect?.addEventListener("change", (e) => {
      if (this.onFilterChange) this.onFilterChange({ sort: e.target.value });
    });
  }
}

export default SearchFilter;
