import { LoadingProduct } from "../components/LoadingProduct";
import { List } from "../components/List";
import { FirstCategory } from "./FirstCategory";

export const Main = ({ pagination = {}, products = [], category = {}, filters = {}, isLoading = false }) => {
  const categoryList = Object.keys(category);
  const limit = pagination?.limit ?? 20;
  const sort = filters?.sort ?? "price_asc";
  // console.log(filters);

  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900">
              <a href="/" data-link="">쇼핑몰</a>
            </h1>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          <div class="mb-4">
            <div class="relative">
              <input
                type="text"
                id="search-input"
                placeholder="상품명을 검색해보세요..."
                value="${filters?.search ?? ""}"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <!-- 필터 옵션 -->
          <div class="space-y-3">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">카테고리:</label>
                <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
              </div>
              <!-- 1depth 카테고리 -->
              <div class="flex flex-wrap gap-2">
                ${
                  categoryList.length > 0
                    ? `${categoryList
                        .map((item) => {
                          return FirstCategory(item);
                        })
                        .join("")}`
                    : `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
                }
              </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select
                  id="limit-select"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  ${[10, 20, 50, 100].map((num) => {
                    return `<option value="${num}" ${num === limit ? `selected=""` : ""}>${num}개</option>`;
                  })}
                </select>
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select
                  id="sort-select"
                  class="text-sm border border-gray-300 rounded px-2 py-1
                            focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  ${[
                    { value: "price_asc", name: "가격 낮은순" },
                    { value: "price_desc", name: "가격 높은순" },
                    { value: "name_asc", name: "이름순" },
                    { value: "name_desc", name: "이름 역순" },
                  ].map(({ value, name }) => {
                    return `<option value="${value}" ${value === sort ? `selected=""` : ""}>${name}</option>`;
                  })}
                </select>
              </div>
            </div>
          </div>

        ${!isLoading && products && pagination.total ? List(products, pagination.total, isLoading) : LoadingProduct()}

      </main>
      <footer class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    </div>
  `;
};
