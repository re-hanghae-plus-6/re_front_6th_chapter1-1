import SearchInput from "./SearchInput.js";
import CategoryFilter from "./CategoryFilter.js";
import SortFilter from "./SortFilter.js";
import PageCountFilter from "./PageCountFilter.js";

class SearchBox {
  constructor() {
    this.searchInput = new SearchInput();
    this.categoryFilter = new CategoryFilter();
    this.sortFilter = new SortFilter();
    this.pageCountFilter = new PageCountFilter();
  }

  /**
   * 컴포넌트가 DOM에 마운트된 후 호출
   */
  mounted() {
    // 각 컴포넌트의 mounted 메서드 호출
    this.searchInput.mounted();
    this.categoryFilter.mounted();
    this.sortFilter.mounted();
    this.pageCountFilter.mounted();
  }

  /**
   * 컴포넌트 렌더링
   */
  render() {
    return /*html*/ `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        ${this.searchInput.render()}
        ${this.categoryFilter.render()}
        
        <div class="flex justify-between items-center mt-4">
          ${this.sortFilter.render()}
          ${this.pageCountFilter.render()}
        </div>
      </div>
    `;
  }
}

export default SearchBox;
