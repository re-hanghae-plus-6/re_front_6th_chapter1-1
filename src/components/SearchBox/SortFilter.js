import stateManager from "../../state/index.js";
import { SORT_OPTIONS, DEFAULT_SORT } from "../../constant.js";

class SortFilter {
  constructor() {
    // 현재 상태에서 정렬 옵션 읽기
    this.currentSort = stateManager.productList.state.sort || DEFAULT_SORT;

    // 상태 구독 설정
    this.setupSubscriptions();
  }

  /**
   * 상태 구독 설정
   */
  setupSubscriptions() {
    stateManager.productList.subscribe(["sort"], () => {
      this.updateSelectValue();
    });
  }

  /**
   * select 요소의 value를 현재 상태로 업데이트
   */
  updateSelectValue() {
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      this.currentSort = stateManager.productList.state.sort || DEFAULT_SORT;
      sortSelect.value = this.currentSort;
    }
  }

  /**
   * 정렬 옵션 변경 이벤트 처리
   */
  handleSortChange = (e) => {
    const sort = e.target.value;

    // 상태 업데이트 (자동으로 상품 로드 및 URL 동기화)
    stateManager.productList.applyFilters({ sort });
  };

  /**
   * DOM 이벤트 리스너 연결
   */
  attachEvents() {
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", this.handleSortChange);
    }
  }

  /**
   * 컴포넌트 마운트 시 URL 파라미터 동기화
   */
  mounted() {
    this.updateSelectValue();
    this.attachEvents();
  }

  /**
   * 렌더링
   */
  render() {
    return /*html*/ `
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">정렬:</label>
        <select id="sort-select"
                class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          ${SORT_OPTIONS.map(
            (option) => /*html*/ `
            <option value="${option.value}" ${option.value === this.currentSort ? "selected" : ""}>${option.label}</option>
          `,
          ).join("")}
        </select>
      </div>
    `;
  }
}

export default SortFilter;
