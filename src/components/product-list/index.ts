import { 상품목록_스켈레톤_카드_그리드 } from "./product-list-loading.ts";
import { 공통_헤더 } from "../header/index.ts";
import { 상품목록_로딩실패 } from "./product-list-error.ts";
import { 브레드크럼, createCategoryBreadcrumb } from "../breadcrumb/index.ts";

export interface ProductCard {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  brand?: string;
}

export interface Props {
  total?: number;
  products?: ProductCard[];
  cartCount?: number;
  isLoadingNextPage?: boolean;
  categories?: Record<string, Record<string, unknown>>;
  category1?: string | null;
  category2?: string | null;
}

interface LayoutProps extends Props {
  loading?: boolean;
  error?: boolean;
}

export const 상품목록_레이아웃 = ({
  loading = false,
  error = false,
  total = 0,
  products = [],
  cartCount = 0,
  isLoadingNextPage = false,
  categories,
  category1 = null,
  category2 = null,
}: LayoutProps): string => {
  // 공통 헤더 HTML
  const headerHtml = 공통_헤더({ cartCount });

  // 카테고리 버튼 생성
  let categoryButtonsHtml = "";
  if (!loading && categories) {
    if (category1 && category2) {
      // 2depth: 같은 category1의 다른 category2들 표시
      const category2Map = categories[category1];
      if (category2Map) {
        const buttons = Object.keys(category2Map)
          .map((cat2) => {
            const isActive = cat2 === category2;
            const baseClass = "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors";
            const style = isActive
              ? "bg-blue-100 border-blue-300 text-blue-800"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
            return `<button data-category1="${category1}" data-category2="${cat2}" class="${baseClass} ${style}">
              ${cat2}
            </button>`;
          })
          .join("");
        categoryButtonsHtml = `<div class="flex flex-wrap gap-2">${buttons}</div>`;
      }
    } else if (category1) {
      // 1depth: 선택된 category1의 category2들 표시
      const category2Map = categories[category1];
      if (category2Map) {
        const buttons = Object.keys(category2Map)
          .map(
            (cat2) => `
            <button data-category1="${category1}" data-category2="${cat2}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              ${cat2}
            </button>`,
          )
          .join("");
        categoryButtonsHtml = `<div class="flex flex-wrap gap-2">${buttons}</div>`;
      }
    } else {
      // 0depth: 모든 category1들 표시
      const buttons = Object.keys(categories)
        .map(
          (cat1) => `
          <button data-category1="${cat1}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
            ${cat1}
          </button>`,
        )
        .join("");
      categoryButtonsHtml = `<div class="flex flex-wrap gap-2">${buttons}</div>`;
    }
  }

  const productGridHtml = loading
    ? 상품목록_스켈레톤_카드_그리드(4)
    : error
      ? 상품목록_로딩실패()
      : products
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
            <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${id}" data-product-price="${price}" data-product-title="${title}">
              장바구니 담기
            </button>
          </div>
        </div>`;
          })
          .join("");

  const listFooterHtml = isLoadingNextPage
    ? `<div class="text-center py-4">
        <div class="inline-flex items-center">
          <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
        </div>
      </div>`
    : `<div class="text-center py-4 text-sm text-gray-500">
        모든 상품을 확인했습니다
      </div>`;

  return `
    <div class="bg-gray-50">
      ${headerHtml}
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
            <!-- 카테고리 필터 -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">카테고리:</label>
                ${브레드크럼({ items: createCategoryBreadcrumb(category1, category2), inline: true })}
              </div>
              ${loading ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>` : categoryButtonsHtml}
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
            ${loading ? "" : `<div class="mb-4 text-sm text-gray-600">총 <span class="font-medium text-gray-900">${total}개</span>의 상품</div>`}
            <!-- 상품 그리드 -->
            <div class="${error ? "" : "grid grid-cols-2 gap-4"} mb-6" id="products-grid">
              ${productGridHtml}
            </div>
                ${listFooterHtml}
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

export default 상품목록_레이아웃;
