export interface ProductCard {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  brand?: string;
}

export interface Props {
  total: number;
  products: ProductCard[];
  cartCount?: number;
}

// NOTE: keep class / id names 그대로 so that existing e2e & unit tests continue to work.
export const 상품목록_레이아웃_로딩완료 = ({ total, products, cartCount = 0 }: Props): string => {
  const cartBadge =
    cartCount > 0
      ? `<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">${cartCount}</span>`
      : "";

  const productCards = products
    .map(({ id, title, price, imageUrl, brand }) => {
      return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" data-product-id="${id}">
          <!-- 상품 이미지 -->
          <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
            <img src="${imageUrl}" alt="${title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" loading="lazy">
          </div>
          <!-- 상품 정보 -->
          <div class="p-3">
            <div class="cursor-pointer product-info mb-3">
              <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${title}</h3>
              ${brand ? `<p class="text-xs text-gray-500 mb-2">${brand}</p>` : '<p class="text-xs text-gray-500 mb-2"></p>'}
              <p class="text-lg font-bold text-gray-900">${price.toLocaleString()}원</p>
            </div>
            <!-- 장바구니 버튼 -->
            <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${id}">
              장바구니 담기
            </button>
          </div>
        </div>`;
    })
    .join("");

  return `
    <div class="bg-gray-50">
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
                ${cartBadge}
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
              <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <!-- 필터 옵션 -->
          <div class="space-y-3">
            <!-- 카테고리 필터 (1depth 예시 - 실제 데이터 필요 시 동적 주입) -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">카테고리:</label>
                <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
              </div>
              <div class="flex flex-wrap gap-2" id="category1-container"><!-- 카테고리 1depth 버튼 렌더 영역 --></div>
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="10">10개</option>
                  <option value="20" selected>20개</option>
                  <option value="50">50개</option>
                  <option value="100">100개</option>
                </select>
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="price_asc" selected>가격 낮은순</option>
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
            <div class="mb-4 text-sm text-gray-600">총 의 상품 <span class="font-medium text-gray-900">${total}개</span></div>
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              ${productCards}
            </div>
            <div class="text-center py-4 text-sm text-gray-500">모든 상품을 확인했습니다</div>
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
