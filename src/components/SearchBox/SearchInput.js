import stateManager from "../../state/index.js";

class SearchInput {
  constructor() {
    // 현재 상태에서 검색어 읽기
    this.currentSearchQuery = stateManager.productList.state.searchQuery || "";

    // 상태 구독 설정
    this.setupSubscriptions();
  }

  /**
   * 상태 구독 설정
   */
  setupSubscriptions() {
    stateManager.productList.subscribe(["searchQuery"], () => {
      this.updateInputValue();
    });
  }

  /**
   * input 요소의 value를 현재 상태로 업데이트
   */
  updateInputValue() {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      this.currentSearchQuery = stateManager.productList.state.searchQuery || "";
      searchInput.value = this.currentSearchQuery;
    }
  }

  /**
   * Enter 키 입력 시 검색 처리
   */
  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const searchQuery = e.target.value.trim();

      // 상태 업데이트 (자동으로 상품 로드 및 URL 동기화)
      stateManager.productList.applyFilters({ searchQuery });
    }
  };

  /**
   * DOM 이벤트 리스너 연결
   */
  attachEvents() {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("keypress", this.handleKeyPress);
    }
  }

  /**
   * 컴포넌트 마운트 시 URL 파라미터 동기화
   */
  mounted() {
    this.updateInputValue();
    this.attachEvents();
  }

  render() {
    return /*html*/ `
      <div class="mb-4">
        <div class="relative">
          <input type="text" id="search-input" 
                 placeholder="상품명을 검색해보세요..." 
                 value="${this.currentSearchQuery}" 
                 class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    `;
  }
}

export default SearchInput;
