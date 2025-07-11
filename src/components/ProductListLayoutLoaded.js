import { ProductListHeader } from "./Header";

const LoadingUI = () => {
  return /* HTML */ `<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
    <div class="aspect-square bg-gray-200"></div>
    <div class="p-3">
      <div class="h-4 bg-gray-200 rounded mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div class="h-8 bg-gray-200 rounded"></div>
    </div>
  </div>`;
};

// 배열 리턴
const LoadingUIList = Array.from({ length: 4 }, () => LoadingUI());

export const CategoryButton = (category, level = 1) => {
  return /* HTML */ `
    <button
      data-category${level}=${category}
      class="category${level}-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
    >
      ${category}
    </button>
  `;
};

export const Search = () => {
  return /* HTML */ `
    <div class="mb-4">
      <div class="relative">
        <input
          type="text"
          id="search-input"
          placeholder="상품명을 검색해보세요..."
          value=""
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  `;
};

export const ProductItem = ({ product: { image, lprice, maker, productId, title } }) => {
  return /* HTML */ `
    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
      data-product-id="${productId}"
    >
      <!-- 상품 이미지 -->
      <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
        <img
          src="${image}"
          alt="${title}"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>
      <!-- 상품 정보 -->
      <div class="p-3">
        <div class="cursor-pointer product-info mb-3">
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${title}</h3>
          <p class="text-xs text-gray-500 mb-2">${maker}</p>
          <p class="text-lg font-bold text-gray-900">${lprice}원</p>
        </div>
        <!-- 장바구니 버튼 -->
        <button
          class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn"
          data-product-id="${productId}"
        >
          장바구니 담기
        </button>
      </div>
    </div>
  `;
};

export const ProductListLayoutLoaded = ({
  products,
  isLoading,
  selectedCategory1 = "",
  selectedCategory2 = "",
  categories,
  limit,
  cartItems,
}) => {
  const categories1 = Object.keys(categories);
  const categories2 = Object.keys(categories[selectedCategory1] || {});

  return /* HTML */ `
    <div class="bg-gray-50">
      ${ProductListHeader({ cart: cartItems })}
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          ${Search()}
          <!-- 필터 옵션 -->
          <div class="space-y-3">
            <!-- 카테고리 필터 -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">카테고리:</label>
                <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
                <span class="text-xs text-gray-500">${selectedCategory1 ? `>` : ""}</span>
                <button data-breadcrumb="category1" data-category1="${selectedCategory1}" class="text-xs hover:text-blue-800 hover:underline">${selectedCategory1 ? `${selectedCategory1}` : ""} </button>
                <span class="text-xs text-gray-500">${selectedCategory2 ? `>` : ""}</span>
                <button data-breadcrumb="category2" data-category1="${selectedCategory1}" data-category2="${selectedCategory2}" class="text-xs hover:text-blue-800 hover:underline">${selectedCategory2 ? `${selectedCategory2}` : ""} </button>
              </div>
              <!-- 카테고리 -->
              <div class="flex flex-wrap gap-2">
                
                ${isLoading ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>` : ""}
                ${selectedCategory1 ? categories2.map((category2) => CategoryButton(category2, 2)).join("") : categories1.map((category1) => CategoryButton(category1, 1)).join("")}
              </div>
            </div>
            
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select id="limit-select"
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="10" ${limit === 10 ? "selected" : ""}>10개</option>
                  <option value="20" ${limit === 20 ? "selected" : ""}>20개</option>
                  <option value="50" ${limit === 50 ? "selected" : ""}>50개</option>
                  <option value="100" ${limit === 100 ? "selected" : ""}>100개</option>
                </select>
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" 
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="price_asc" selected="">가격 낮은순</option>
                  <option value="price_desc">가격 높은순</option>
                  <option value="name_asc">이름순</option>
                  <option value="name_desc">이름 역순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            <!-- 상품 개수 정보 -->
            <div class="mb-4 text-sm text-gray-600">
              총 <span class="font-medium text-gray-900">${products.length}개</span>의 상품
            </div>
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              ${
                isLoading
                  ? LoadingUIList.join("")
                  : products
                      .slice(0, limit)
                      .map((product) => ProductItem({ product }))
                      .join("")
              }
                </div>
              </div>
            </div>
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
};
