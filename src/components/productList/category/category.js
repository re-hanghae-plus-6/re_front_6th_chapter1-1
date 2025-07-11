import { Breadcrumb } from "./breadcrumb.js";
import { SearchBar } from "./searchBar.js";
import { ProductCountDropdown } from "./productCountDropdown.js";
import { ProductOrderByDropdown } from "./productOrderByDropdown.js";
import { categorySelectors } from "./categorySelectors.js";

export const Category = ({ state }) => {
  const { filters, pagination, categoryLoading, categories } = state;

  return `
      <!-- 검색 및 필터 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
          ${SearchBar({
            search: filters.search,
          })}
        </div>
        
        <!-- 필터 옵션 -->
        <div class="space-y-3">

          <!-- 카테고리 필터 -->
          <div class="space-y-2">
            ${Breadcrumb({
              category1: filters.category1,
              category2: filters.category2,
            })}
            <div class="space-y-2">
                ${
                  categoryLoading
                    ? '<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>'
                    : categorySelectors({ category1: filters.category1, category2: filters.category2, categories })
                }
            </div>
          </div>
          
          <!-- 기존 필터들 -->
          <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            ${ProductCountDropdown({
              limit: pagination?.limit,
            })}
            <!-- 정렬 -->
            ${ProductOrderByDropdown({
              sort: filters.sort,
            })}
          </div>
        </div>
      </div>
  `;
};
