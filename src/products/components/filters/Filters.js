import { Component } from "../../../core/Component";
import { html } from "../../../utils/html";
import { Breadcrumb } from "./Breadcrumb";
import { LimitSelect } from "./LimitSelect";
import { Search } from "./Search";
import { SortSelect } from "./SortSelect";

export class Filters extends Component {
  search = new Search();
  breadcrumb = new Breadcrumb();
  limitSelect = new LimitSelect();
  sortSelect = new SortSelect();

  renderContainer() {
    return html` <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <!-- 검색창 -->
      ${this.search}
      <!-- 필터 옵션 -->
      <div class="space-y-3">
        <!-- 카테고리 필터 -->
        ${this.breadcrumb}
        <!-- 기존 필터들 -->
        <div class="flex gap-2 items-center justify-between">
          <!-- 페이지당 상품 수 -->
          ${this.limitSelect}
          <!-- 정렬 -->
          ${this.sortSelect}
        </div>
      </div>
    </div>`;
  }
}
