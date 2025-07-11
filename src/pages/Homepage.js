import Header from "../components/Header";
import Footer from "../components/Footer";

const SearchInput = () => {
  return /* HTML */ `
    <div class="relative">
      <input
        type="text"
        id="search-input"
        placeholder="상품명을 검색해보세요..."
        value=""
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
  `;
};
const PagingSelector = () => {
  return /* HTML */ `<select
    id="limit-select"
    class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
  >
    <option value="10">10개</option>
    <option value="20" selected="">20개</option>
    <option value="50">50개</option>
    <option value="100">100개</option>
  </select> `;
};

const SortSelector = () => {
  return /* HTML */ `<select
    id="sort-select"
    class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
  >
    <option value="price_asc" selected="">가격 낮은순</option>
    <option value="price_desc">가격 높은순</option>
    <option value="name_asc">이름순</option>
    <option value="name_desc">이름 역순</option>
  </select>`;
};

const LoadingIndicator = (text) => {
  return /* HTML */ `
    <div class="inline-flex items-center">
      <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span class="text-sm text-gray-600">${text}</span>
    </div>
  `;
};

const LoadingUI = () => {
  return /* HTML */ ` <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
    <div class="aspect-square bg-gray-200"></div>
    <div class="p-3">
      <div class="h-4 bg-gray-200 rounded mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div class="h-8 bg-gray-200 rounded"></div>
    </div>
  </div>`;
};

const LoadingUIList = LoadingUI().repeat(4);

const ProductItem = (product) => {
  return /* HTML */ `
    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
      data-product-id="${product.productId}"
    >
      <a href="/product/${product.productId}" data-link class="block">
      <!-- 상품 이미지 -->
      <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
        <img
          src="${product.image}"
          alt="${product.title}"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>
      <!-- 상품 정보 -->
      <div class="p-3">
        <div class="cursor-pointer product-info mb-3">
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${product.title}</h3>
          <p class="text-xs text-gray-500 mb-2"></p>
          <p class="text-lg font-bold text-gray-900">${product.lprice}원</p>
        </div>
      </a>
        <!-- 장바구니 버튼 -->
        <button
          class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                          hover:bg-blue-700 transition-colors add-to-cart-btn"
          data-product-id="${product.productId}"
        >
          장바구니 담기
        </button>
      </div>
    </div>
  `;
};

export const HomePage = ({
  categories,
  products,
  total,
  loading,
  isFetchingMore,
  hasMore,
  selectedCategory1,
  selectedCategory2,
}) => {
  const category1List = Object.keys(categories);

  let breadcrumbHtml = `
    <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
  `;
  if (selectedCategory1) {
    breadcrumbHtml += `
      <span class="text-xs text-gray-500">&gt;</span>
      <button data-breadcrumb="category1" data-category1="${selectedCategory1}" class="text-xs hover:text-blue-800 hover:underline">
        ${selectedCategory1}
      </button>
    `;
    if (selectedCategory2) {
      breadcrumbHtml += `
        <span class="text-xs text-gray-500">&gt;</span>
        <span class="text-xs text-gray-600 cursor-default">${selectedCategory2}</span>
      `;
    }
  }

  let category1ButtonsHtml = "";
  if (!selectedCategory1) {
    category1ButtonsHtml = `
      <div class="flex flex-wrap gap-2">
        ${category1List
          .map(
            (cat1) => `
          <button data-category1="${cat1}" data-breadcrumb="category1" class="text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
            ${cat1}
          </button>
        `,
          )
          .join("")}
      </div>
    `;
  }

  let category2ButtonsHtml = "";
  if (selectedCategory1 && categories[selectedCategory1] && categories[selectedCategory1].length > 0) {
    category2ButtonsHtml = `
      <div class="space-y-2">
        <div class="flex flex-wrap gap-2">
          ${categories[selectedCategory1]
            .map((cat2) => {
              const isActive = cat2 === selectedCategory2;
              const buttonClass = isActive
                ? `bg-blue-100 border-blue-300 text-blue-800`
                : `bg-white border-gray-300 text-gray-700 hover:bg-gray-50`;
              return `
              <button data-category1="${selectedCategory1}" data-category2="${cat2}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors ${buttonClass}">
                ${cat2}
              </button>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${Header({
        title: "쇼핑몰",
        buttonType: "home",
        cartItemCount: 0,
      })}
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          <div class="mb-4">${SearchInput()}</div>
          <!-- 필터 옵션 -->
          <div class="space-y-3">
            <!-- 카테고리 필터 -->
            <div class="space-y-2">
              <!-- 1depth 카테고리 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">카테고리:</label>
                ${breadcrumbHtml}
              </div>
              <!-- 1depth 카테고리 -->
              ${loading ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>` : category1ButtonsHtml}
              <!-- 2depth 카테고리  -->
              ${category2ButtonsHtml}
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                ${PagingSelector()}
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                ${SortSelector()}
              </div>
            </div>
          </div>
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            <!-- 상품 개수 정보 -->
            ${loading
              ? ""
              : `
              <div class="mb-4 text-sm text-gray-600">
              총 <span class="font-medium text-gray-900">${total}개</span>의 상품
              </div>
              `}
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              <!-- 로딩 스켈레톤 -->
              ${loading
                ? LoadingUIList
                : `
                ${products.map(ProductItem).join("")}
                `}
            </div>

            <!-- 무한 스크롤 로딩 인디케이터 -->
            <div class="text-center py-4">
              ${isFetchingMore ? LoadingIndicator("상품을 불러오는 중...") : ""}
              ${!hasMore && !loading ? `<p class="text-gray-500">더 이상 상품이 없습니다.</p>` : ""}
            </div>
          </div>
        </div>
      </main>
      ${Footer()}
    </div>
  `;
};
