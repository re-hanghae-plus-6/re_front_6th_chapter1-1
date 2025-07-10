import { getCategories } from "../../api/productApi.js";

class SearchFilter {
  constructor(onFilterChange) {
    this.el = null;
    this.onFilterChange = onFilterChange;
    this.state = {
      categories: {},
      isLoading: true,
      selectedCategories: [],
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
    const { categories, isLoading, selectedCategories } = this.state;

    // 브레드크럼 렌더링
    const breadcrumbContainer = this.el.querySelector(".space-y-2 > div.flex.items-center.gap-2");
    if (breadcrumbContainer) {
      // 1. 브레드크럼 초기화: label + 전체 버튼만 고정
      breadcrumbContainer.innerHTML = `
    <label class="text-sm text-gray-600">카테고리:</label>
    <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
  `;

      // 2. '전체' 버튼 이벤트 연결 (한 번만 바인딩)
      const resetButton = breadcrumbContainer.querySelector('[data-breadcrumb="reset"]');
      resetButton?.addEventListener("click", () => {
        this.setState({ selectedCategories: [] });
        if (this.onFilterChange) this.onFilterChange({ category1: undefined, category2: undefined });
      });

      // 3. 선택된 카테고리 렌더링
      const { selectedCategories } = this.state;

      selectedCategories.forEach((cat, index) => {
        const isLast = index === selectedCategories.length - 1;

        // 구분자 추가: >
        const separator = document.createElement("span");
        separator.className = "text-xs text-gray-500";
        separator.textContent = ">";
        breadcrumbContainer.appendChild(separator);

        if (isLast) {
          // 마지막: span
          const span = document.createElement("span");
          span.className = "text-xs text-gray-600 cursor-default";
          span.textContent = cat;
          breadcrumbContainer.appendChild(span);
        } else {
          // 중간 카테고리: 버튼
          const btn = document.createElement("button");
          btn.className = "text-xs hover:text-blue-800 hover:underline";
          btn.setAttribute("data-breadcrumb", `category${index + 1}`);
          btn.setAttribute("data-category1", selectedCategories[0]); // 필요시 확장
          btn.textContent = cat;
          breadcrumbContainer.appendChild(btn);
        }
      });
    }

    // 하위 카테고리 렌더링
    let currentCategories = categories;
    selectedCategories.forEach((cat) => {
      currentCategories = currentCategories?.[cat] || {};
    });
    // ✅ updateContent 메서드의 하위 카테고리 렌더링 부분만 교체
    const categoryListHtml = isLoading
      ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
      : (() => {
          const [category1, category2] = selectedCategories;

          const targetCategoryLevel = category1 ? categories?.[category1] || {} : categories;

          const buttons = Object.keys(targetCategoryLevel).map((cat) => {
            const isSelected = cat === category2 || (!category2 && cat === category1);

            return category1
              ? `<button data-category1="${category1}" data-category2="${cat}" 
              class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
              ${isSelected ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
              ${cat}
            </button>`
              : `<button data-category1="${cat}" 
              class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
              ${isSelected ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
              ${cat}
            </button>`;
          });

          return buttons.join("");
        })();

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
    const categoryContainer = this.el.querySelector(".flex.flex-wrap.gap-2");
    const breadcrumbContainer = this.el.querySelector(".space-y-2 > div.flex.items-center.gap-2");

    searchInput?.addEventListener("input", this.handleSearch);

    limitSelect?.addEventListener("change", (e) => {
      if (this.onFilterChange) this.onFilterChange({ limit: e.target.value });
    });

    sortSelect?.addEventListener("change", (e) => {
      if (this.onFilterChange) this.onFilterChange({ sort: e.target.value });
    });
    // ✅ addEvent() 메서드 내 categoryContainer 클릭 이벤트를 이처럼 교체
    categoryContainer?.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-category1]");
      if (!btn) return;

      const category1 = btn.dataset.category1;
      const category2 = btn.dataset.category2;

      let newSelected;

      // 1뎁스 선택 시: [category1]
      if (!category2) {
        newSelected = [category1];
      } else {
        // 2뎁스 선택 시: [category1, category2]
        newSelected = [category1, category2];
      }

      this.setState({ selectedCategories: newSelected });

      if (this.onFilterChange) {
        this.onFilterChange({ category1, category2 });
      }
    });

    breadcrumbContainer?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-breadcrumb-index]");
      if (!btn) return;

      const index = Number(btn.dataset.breadcrumbIndex);
      const newSelected = this.state.selectedCategories.slice(0, index + 1);
      this.setState({ selectedCategories: newSelected });

      const [category1, category2] = newSelected;
      if (this.onFilterChange) {
        this.onFilterChange({ category1, category2 });
      }
    });
  }
}

export default SearchFilter;
