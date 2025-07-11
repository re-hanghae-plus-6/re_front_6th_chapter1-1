import { LimitSelectedBox } from "../components/LimitSelectedBox.js";
import { ProductItem } from "../components/ProductItem.js";
import { LoadingList } from "../components/Loading.js";

export const MainPage = (appState) => {
  // store 기반 상태 구조에 맞게 데이터 추출
  const {
    products: {
      products = [],
      total = 0,
      loading = false,
      limit = 20,
      search = "",
      sort = "price_asc",
      isFirstLoad = true,
    } = {},
    categories = [],
    categoriesLoading = false,
    selectedCategories = {},
  } = appState || {};

  // selectedCategories에서 개별 값 추출
  const selectedCategory1 = selectedCategories.category1 || "";
  const selectedCategory2 = selectedCategories.category2 || "";

  console.log("🔍 categories 배열:", categories);
  console.log("🔍 categories 길이:", categories.length);
  console.log("🔍 categoriesLoading:", categoriesLoading);
  console.log("🔍 selectedCategories:", selectedCategories);

  return `
    <div class="min-h-screen bg-gray-50">
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          <div class="mb-4">
            <div class="relative">
              <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${search}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <!-- 필터 옵션 -->
          <div class="space-y-3">

            <!-- 카테고리 필터 -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">카테고리:</label>
                <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
                ${selectedCategory1 ? `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1="${selectedCategory1}" class="text-xs hover:text-blue-800 hover:underline">${selectedCategory1}</button>` : ""}
                ${selectedCategory2 ? `<span class="text-xs text-gray-500">&gt;</span><span class="text-xs text-gray-600 cursor-default">${selectedCategory2}</span>` : ""}
              </div>
              <!-- 1depth 카테고리 -->
              ${
                !selectedCategory1
                  ? `
              <div class="flex flex-wrap gap-2">
              ${
                categoriesLoading
                  ? '<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>'
                  : categories
                      .map(
                        (category) => `
                          <button 
                            data-category1="${category.name}" 
                            class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                            ${selectedCategory1 === category.name ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
                            ${category.name}
                          </button>
                        `,
                      )
                      .join("")
              }
              </div>
              `
                  : ""
              }
              <!-- 2depth 카테고리 -->
              ${
                selectedCategory1
                  ? `
                <div class="space-y-2">
                  <div class="flex flex-wrap gap-2">
                    ${
                      categories
                        .find((cat) => cat.name === selectedCategory1)
                        ?.subCategories?.map(
                          (category2) => `
                          <button 
                            data-category1="${selectedCategory1}"
                            data-category2="${category2}"
                            class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                            ${selectedCategory2 === category2 ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
                            ${category2}
                          </button>
                        `,
                        )
                        .join("") || ""
                    }
                  </div>
                </div>
              `
                  : ""
              }
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                ${LimitSelectedBox({ value: limit })}
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="price_asc" ${sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
                  <option value="price_desc" ${sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
                  <option value="name_asc" ${sort === "name_asc" ? "selected" : ""}>이름순</option>
                  <option value="name_desc" ${sort === "name_desc" ? "selected" : ""}>이름 역순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            <!-- 상품 개수 정보 -->
            ${
              isFirstLoad
                ? ""
                : loading
                  ? `
              <div id="product-count" class="mb-4 text-sm text-gray-600">
                총 <span class="font-medium text-gray-900">0개</span>의 상품
              </div>
              `
                  : `
              <div id="product-count" class="mb-4 text-sm text-gray-600">
                총 <span class="font-medium text-gray-900">${total}개</span>의 상품
              </div>
              `
            }
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              <!-- 로딩 스켈레톤 (초기 로딩시에만) -->
              ${
                isFirstLoad
                  ? LoadingList()
                  : products
                      .map(
                        (product) => `
                <a href="/product/${product.productId}" data-link style="display:block;text-decoration:none;color:inherit;">
                  ${ProductItem(product)}
                </a>
              `,
                      )
                      .join("")
              }
           </div>            
            ${
              loading && !isFirstLoad
                ? `
            <div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
              </div>
            </div>
            `
                : ""
            }
          </div>
        </div>
      </main>
    </div>
  `;
};
