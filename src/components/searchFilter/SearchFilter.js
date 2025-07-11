import { CategoryFilter } from "./CategoryFilter";
import { ProductSortSelect } from "./ProductSortSelect";
import { QuantitySelect } from "./QuantitySelect";
import { SearchBar } from "./SearchBar";

export const SearchFilter = () => `
<!-- 검색 및 필터 -->
<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
  <!-- 검색창 -->
  ${SearchBar()}
  <!-- 필터 옵션 -->
  <div class="space-y-3">
    <!-- 카테고리 필터 -->
    ${CategoryFilter()}
    <!-- 기존 필터들 -->
    <div class="flex gap-2 items-center justify-between">
      <!-- 페이지당 상품 수 -->
      ${QuantitySelect()}
      <!-- 정렬 -->
      ${ProductSortSelect()}
    </div>
  </div>
</div>

`;
