import { LimitSelect, SortSelect } from "./components/Select";
import { ProductListSkeleton } from "./components/Loader";
import { ProductItem } from "./components/ProductItem";
import { LIMIT_OPTIONS, SORT_OPTIONS } from "./constants";
import SearchInput from "./components/SearchInput";
import CategoryFilter from "./components/CategoryFilter";
import Header from "./components/Header";

export default function HomPage(state) {
  return /*html */ `
    <div class="bg-gray-50">
       ${Header({ state })}
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          ${SearchInput({ state })}
          <!-- 필터 옵션 -->
          ${CategoryFilter({ state })}
          <!-- 기존 필터들 -->
          <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            ${LimitSelect({
              options: LIMIT_OPTIONS,
              selectedValue: state.filters.limit,
            })}
            <!-- 정렬 -->
            ${SortSelect({
              options: SORT_OPTIONS,
              selectedValue: state.filters.sort,
            })}
          </div>
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            <!-- 상품 개수 정보 -->
            <div class="mb-4 text-sm text-gray-600">
              ${state.loading ? "" : `총 <span class="font-medium text-gray-900">${state.total}개</span>의 상품`}
            </div>
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                ${state.loading && state.products.length === 0 ? ProductListSkeleton : state.products.map(ProductItem).join("")}
            </div>
            ${
              state.loading && state.products.length > 0
                ? /*html*/ `
                  <div class="text-center py-4">
                    <div class="text-sm text-gray-600">상품을 불러오는 중...</div>
                  </div>
                `
                : ""
            }
            <div class="text-center py-4 text-sm text-gray-500">
              모든 상품을 확인했습니다
            </div>
          </div>
        </div>
      </main>
      <footer class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    </div>
  `;
}
