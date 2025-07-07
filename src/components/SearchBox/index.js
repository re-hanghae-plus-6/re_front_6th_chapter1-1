import SearchInput from "./SearchInput";
import CategoryFilter from "./CategoryFilter";
import PageCountFilter from "./PageCountFilter";
import SortFilter from "./SortFilter";

class SearchBox {
  constructor() {
    this.searchInput = new SearchInput();
    this.categoryFilter = new CategoryFilter();
    this.pageCountFilter = new PageCountFilter();
    this.sortFilter = new SortFilter();
  }

  render() {
    return /*html*/ `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
          ${this.searchInput.render()}
        </div>
        <!-- 필터 옵션 -->
        <div class="space-y-3">
          <!-- 카테고리 필터 -->
          <div class="space-y-2">
            ${this.categoryFilter.render()}
          </div>
          <!-- 기존 필터들 -->
          <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            <div class="flex items-center gap-2">
              ${this.pageCountFilter.render()}
            </div>
            <!-- 정렬 -->
            <div class="flex items-center gap-2">
              ${this.sortFilter.render()}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default SearchBox;
