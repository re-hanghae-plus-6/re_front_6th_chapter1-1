import { getCategories } from "../../api/productApi.js";

class SearchFilter {
  constructor(onFilterChange) {
    this.el = null;
    this.onFilterChange = onFilterChange;
    this.state = {
      categories: {},
      isLoading: true,
      selectedCategories: [], // 이 부분은 render에서 초기화될 예정
      searchQuery: "", // 검색어 상태 추가
    };

    // Debounce a la gestion des recherches
    this.handleSearch = this.debounce((e) => {
      this.setState({ searchQuery: e.target.value }); // 검색어 상태 업데이트
      if (this.onFilterChange) this.onFilterChange({ search: e.target.value });
    }, 300);

    this.fetchCategories();
  }

  async fetchCategories() {
    // 카테고리 데이터가 아직 로드되지 않았을 때만 isLoading을 true로 설정
    if (Object.keys(this.state.categories).length === 0) {
      this.setState({ isLoading: true });
    }
    try {
      const data = await getCategories();
      this.setState({ categories: data, isLoading: false });

      // SearchFilter는 필터 변경을 Home.js에 알리는 역할만 하고,
      // 초기 상품 목록 로딩은 Home.js의 init에서 담당하므로 이 부분은 제거합니다.
      // if (this.onFilterChange) {
      //   this.onFilterChange({ category1: undefined, category2: undefined });
      // }
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
    <button data-breadcrumb-index="-1" class="text-xs hover:text-blue-800 hover:underline">전체</button>
  `;

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
          btn.setAttribute("data-breadcrumb-index", index); // data-breadcrumb-index 추가
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

    const categoryContainer = this.el.querySelector(".flex.flex-wrap.gap-2");

    if (categoryContainer) {
      const [category1, category2] = selectedCategories;

      // 초기 로딩 중이거나, 카테고리가 선택되지 않은 상태에서 로딩 중일 때만 로딩 메시지 표시
      // 카테고리 데이터가 로드되었고, selectedCategories가 비어있지 않으면 로딩 메시지를 표시하지 않습니다.
      if (isLoading && Object.keys(categories).length === 0) {
        // categories가 비어있을 때만 로딩 메시지 표시
        categoryContainer.innerHTML = `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`;
        return;
      }

      const targetCategories = category1 ? categories?.[category1] || {} : categories;

      const existingButtons = Array.from(categoryContainer.querySelectorAll("button"));

      const categoryNames = Object.keys(targetCategories);

      // 기존 버튼과 동일하면 클래스만 업데이트 (깜박임 방지)
      const isSame =
        existingButtons.length === categoryNames.length &&
        existingButtons.every((btn, idx) => btn.textContent.trim() === categoryNames[idx]);

      if (isSame) {
        existingButtons.forEach((btn) => {
          const cat = btn.textContent.trim();
          const isSelected = cat === category2 || (!category2 && cat === category1);
          btn.className = `
            ${category1 ? "category2-filter-btn" : "category1-filter-btn"}
            text-left px-3 py-2 text-sm rounded-md border transition-colors
            ${isSelected ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
          `.trim();
        });
      } else {
        // 전체 교체
        const buttons = categoryNames.map((cat) => {
          const isSelected = cat === category2 || (!category2 && cat === category1);

          const escapedText = cat.replace(/</g, "&lt;").replace(/>/g, "&gt;");

          return category1
            ? `<button data-category1="${category1}" data-category2="${cat}" 
        class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
        ${isSelected ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
        ${escapedText}
      </button>`
            : `<button data-category1="${cat}" 
        class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
        ${isSelected ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
        ${escapedText}
      </button>`;
        });
        categoryContainer.innerHTML = buttons.join("");
      }
    }
  }

  render(filters = {}) {
    // filters 매개변수 추가
    // filters를 사용하여 SearchFilter의 내부 상태를 초기화/업데이트
    const selectedCategories = [];
    if (filters.category1) {
      selectedCategories.push(filters.category1);
    }
    if (filters.category2) {
      selectedCategories.push(filters.category2);
    }
    this.state.selectedCategories = selectedCategories;
    this.state.searchQuery = filters.search || ""; // 검색어 상태 업데이트

    if (!this.el) {
      this.el = document.createElement("div");
      this.el.className = "bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4";
      this.el.innerHTML = `
           <!-- 검색창 -->
           <div class="mb-4">
             <div class="relative">
               <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${this.state.searchQuery}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                   <option value="20" ${filters.limit === 20 ? "selected" : ""}>20개</option>
                   <option value="50" ${filters.limit === 50 ? "selected" : ""}>50개</option>
                   <option value="100" ${filters.limit === 100 ? "selected" : ""}>100개</option>
                 </select>
               </div>
               <div class="flex items-center gap-2">
                 <label class="text-sm text-gray-600">정렬:</label>
                 <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                   <option value="price_asc" ${filters.sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
                   <option value="price_desc" ${filters.sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
                    <option value="name_asc" ${filters.sort === "name_asc" ? "selected" : ""}>이름순</option>
                    <option value="name_desc" ${filters.sort === "name_desc" ? "selected" : ""}>이름 역순</option>
                  </select>
                </div>
              </div>
            </div>
          `;
    } else {
      // 이미 엘리먼트가 있다면 검색창의 value만 업데이트
      this.el.querySelector("#search-input").value = this.state.searchQuery;
      this.el.querySelector("#limit-select").value = filters.limit;
      this.el.querySelector("#sort-select").value = filters.sort;
    }
    this.updateContent();
    this.addEvent();
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

    // searchInput?.addEventListener("input", this.handleSearch);
    // Enter 키 입력 시 즉시 검색 실행
    searchInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (this.onFilterChange) {
          this.onFilterChange({ search: e.target.value });
        }
      }
    });

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
