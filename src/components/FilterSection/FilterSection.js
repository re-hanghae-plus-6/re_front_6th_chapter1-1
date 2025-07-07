import { Category } from "./Category";
import { Sort } from "./Sort";
import { SearchBar } from "./SearchBar";
import { ItemCount } from "./ItemCount";

export const FilterSection = ({
  keyword = "",
  categories = {},
  category1 = "",
  category2 = "",
  isLoading = false,
  count = 20,
  sort = "price_asc",
}) => {
  return /* HTML */ ` <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
    <!-- 검색창 -->
    ${SearchBar(keyword)}
    <!-- 필터 옵션 -->
    <div class="space-y-3">
      <!-- 카테고리 필터 -->
      ${Category(categories, category1, category2, isLoading)}
      </div>
      <!-- 기존 필터들 -->
      <div class="flex gap-2 items-center justify-between">
        <!-- 페이지당 상품 수 -->
        ${ItemCount(count)}
        <!-- 정렬 -->
        ${Sort(sort)}
      </div>
    </div>
  </div>`;
};
