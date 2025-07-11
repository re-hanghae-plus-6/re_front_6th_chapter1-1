import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { productStore, productActions } from "../store/productStore.js";

// 현재 렌더링 상태 추적
let currentPageType = "home";
let currentParams = {};

// 페이지 설정 정의
const pageConfigs = {
  home: {
    title: "쇼핑몰",
    showBackButton: false,
    renderContent: renderHomeContent,
  },
  "product-detail": {
    title: "상품 상세",
    showBackButton: true,
    renderContent: renderProductDetailContent,
  },
  404: {
    title: "404 페이지",
    showBackButton: false,
    renderContent: render404Content,
  },
};

// 메인 렌더링 함수
export function render(pageType = "home", params = {}) {
  console.log("렌더링 시작:", pageType, params);

  // 현재 상태 업데이트
  currentPageType = pageType;
  currentParams = params;

  const config = pageConfigs[pageType];
  if (!config) {
    console.error(`페이지 설정을 찾을 수 없습니다: ${pageType}`);
    return render("404");
  }

  // 앱 컨테이너 찾기 - #root로 변경
  const root = document.getElementById("root");
  if (!root) {
    console.error("#root 엘리먼트를 찾을 수 없습니다.");
    return;
  }

  // 전체 페이지 렌더링
  root.innerHTML = `
    <div class="bg-gray-50">
      ${Header({
        title: config.title,
        showBackButton: config.showBackButton,
        cartCount: getCartCount(),
      })}
      <main class="max-w-md mx-auto px-4 py-4">
        ${config.renderContent(params)}
      </main>
      ${Footer()}
    </div>
    ${renderCartModal()}
    ${renderToastContainer()}
  `;

  console.log("렌더링 완료");
}

// 홈 페이지 콘텐츠 렌더링
function renderHomeContent(params) {
  const state = productStore.getState();
  const { filters, products, total, isLoading, error } = state;

  // URL 쿼리 파라미터로 상태 복원
  if (params.search || params.sort || params.limit || params.category1 || params.category2) {
    productActions.loadFromURL(params);
  }

  return `
    ${renderSearchFilter(filters)}
    ${renderProductSection(products, total, isLoading, error)}
  `;
}

// 상품 상세 페이지 콘텐츠 렌더링
function renderProductDetailContent(params) {
  const { id } = params;
  console.log("상품 상세 페이지 렌더링", id);

  return `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="text-center py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장</h1>
        
        <!-- 상품 이미지 -->
        <div class="mb-6">
          <img src="https://shopping-phinf.pstatic.net/main_8506721/85067212996.1.jpg" 
               alt="PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장"
               class="w-full h-64 object-cover rounded-lg">
        </div>
        
        <!-- 가격 -->
        <p class="text-2xl font-bold text-gray-900 mb-6">220원</p>
        
        <!-- 수량 선택 -->
        <div class="flex items-center justify-center gap-4 mb-6">
          <button id="quantity-decrease" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">-</button>
          <input type="number" id="quantity-input" value="1" min="1" class="w-16 text-center border border-gray-300 rounded-md py-2">
          <button id="quantity-increase" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">+</button>
        </div>
        
        <!-- 장바구니 담기 버튼 -->
        <button id="add-to-cart-btn" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          장바구니 담기
        </button>
      </div>
      
      <div class="mt-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">관련 상품</h2>
        <div class="grid grid-cols-2 gap-4">
          ${renderRelatedProducts()}
        </div>
      </div>
    </div>
  `;
}

// 404 페이지 콘텐츠 렌더링
function render404Content(params) {
  console.log("404 페이지 렌더링", params);
  return `
    <div class="text-center py-12">
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">페이지를 찾을 수 없습니다</h2>
        <p class="text-gray-600 mb-2">요청하신 페이지가 존재하지 않습니다.</p>
        <p class="text-sm text-gray-500">경로: ${window.location.pathname}</p>
      </div>
      
      <div class="space-y-3">
        <a href="/" data-link class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          홈으로 돌아가기
        </a>
        <br>
        <button onclick="window.history.back()" class="text-blue-600 hover:text-blue-800 hover:underline">
          이전 페이지로 돌아가기
        </button>
      </div>
    </div>
  `;
}

// 검색 필터 렌더링
function renderSearchFilter(filters) {
  const { search, sort, limit, category1, category2 } = filters;

  return `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <!-- 검색창 -->
      <div class="mb-4">
        <div class="relative">
          <input type="text" id="search-input" 
                 placeholder="상품명을 검색해보세요..." 
                 value="${search || ""}"
                 class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
            ${category1 ? `<span class="text-xs text-gray-500"> > ${category1}</span>` : ""}
            ${category2 ? `<span class="text-xs text-gray-500"> > ${category2}</span>` : ""}
          </div>
          
          <!-- 1depth 카테고리 -->
          <div class="flex flex-wrap gap-2">
            <button data-category1="생활/건강" 
                    class="category1-filter-btn px-3 py-2 text-sm rounded-md border transition-colors ${category1 === "생활/건강" ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
              생활/건강
            </button>
            <button data-category1="디지털/가전" 
                    class="category1-filter-btn px-3 py-2 text-sm rounded-md border transition-colors ${category1 === "디지털/가전" ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
              디지털/가전
            </button>
          </div>
          
          <!-- 2depth 카테고리 -->
          ${
            category1 === "생활/건강"
              ? `
            <div class="flex flex-wrap gap-2">
              <button data-category2="자동차용품" class="px-3 py-2 text-sm rounded-md border transition-colors ${category2 === "자동차용품" ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
                자동차용품
              </button>
            </div>
          `
              : ""
          }
        </div>
        
        <!-- 기존 필터들 -->
        <div class="flex gap-2 items-center justify-between">
          <!-- 페이지당 상품 수 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">개수:</label>
            <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="10" ${limit === 10 ? "selected" : ""}>10개</option>
              <option value="20" ${limit === 20 ? "selected" : ""}>20개</option>
              <option value="50" ${limit === 50 ? "selected" : ""}>50개</option>
              <option value="100" ${limit === 100 ? "selected" : ""}>100개</option>
            </select>
          </div>
          
          <!-- 정렬 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">정렬:</label>
            <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="price_asc" ${sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
              <option value="price_desc" ${sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
              <option value="name_asc" ${sort === "name_asc" ? "selected" : ""}>이름순</option>
              <option value="name_desc" ${sort === "name_desc" ? "selected" : ""}>이름 역순</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 상품 섹션 렌더링
function renderProductSection(products, total, isLoading, error) {
  if (error) {
    return `
      <div class="text-center py-8">
        <div class="text-red-500 mb-4">
          <svg class="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-sm">상품을 불러오는 중 오류가 발생했습니다.</p>
        </div>
        <button onclick="window.location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          다시 시도
        </button>
      </div>
    `;
  }

  if (isLoading && products.length === 0) {
    return `
      <div class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">카테고리 로딩 중...</p>
      </div>
    `;
  }

  return `
    <div class="mb-6">
      <!-- 상품 개수 정보 -->
      <div class="mb-4 text-sm text-gray-600">
        총 <span class="font-medium text-gray-900">${total.toLocaleString()}</span>개의 상품
      </div>
      
      <!-- 상품 그리드 -->
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${products.map((product) => renderProductCard(product)).join("")}
      </div>
      
      ${
        products.length === 0 && !isLoading
          ? `
        <div class="text-center py-8">
          <p class="text-gray-500">조건에 맞는 상품이 없습니다.</p>
        </div>
      `
          : ""
      }
      
      ${
        products.length > 0 && products.length >= total
          ? `
        <div class="text-center py-4 text-sm text-gray-500">
          모든 상품을 확인했습니다
        </div>
      `
          : ""
      }
      
      ${
        isLoading && products.length > 0
          ? `
        <div class="text-center py-4">
          <p class="text-gray-600">상품을 불러오는 중...</p>
        </div>
      `
          : ""
      }
    </div>
  `;
}

// 상품 카드 렌더링
function renderProductCard(product) {
  return `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" 
         data-product-id="${product.id}">
      <!-- 상품 이미지 -->
      <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
        <img src="${product.image}" 
             alt="${product.name}"
             class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
             loading="lazy">
      </div>
      
      <!-- 상품 정보 -->
      <div class="p-3">
        <div class="cursor-pointer product-info mb-3">
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
            ${product.name}
          </h3>
          ${product.brand ? `<p class="text-xs text-gray-500 mb-2">${product.brand}</p>` : ""}
          <p class="text-lg font-bold text-gray-900">
            ${product.price?.toLocaleString() || "0"}원
          </p>
        </div>
        
        <!-- 장바구니 버튼 -->
        <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" 
                data-product-id="${product.id}">
          장바구니 담기
        </button>
      </div>
    </div>
  `;
}

// 관련 상품 렌더링 (19개, 현재 상품 제외)
function renderRelatedProducts() {
  // 임시 관련 상품 데이터 (19개)
  const relatedProducts = Array.from({ length: 19 }, (_, i) => ({
    id: i + 1000,
    name: `관련 상품 ${i + 1}`,
    price: (i + 1) * 1000,
    image: "https://via.placeholder.com/200",
  }));

  return relatedProducts
    .map(
      (product) => `
    <div class="related-product-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer" 
         data-product-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" class="w-full h-20 object-cover">
      <div class="p-2">
        <h4 class="text-xs font-medium text-gray-900 mb-1">${product.name}</h4>
        <p class="text-sm font-bold text-gray-900">${product.price.toLocaleString()}원</p>
      </div>
    </div>
  `,
    )
    .join("");
}

// 장바구니 모달 렌더링
function renderCartModal() {
  return `
    <div class="cart-modal-overlay fixed inset-0 bg-black bg-opacity-50 z-50 hidden" style="display: none;">
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-96 max-h-96 overflow-y-auto">
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">장바구니</h2>
            <button id="cart-modal-close-btn" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="cart-items">
            <p class="text-center text-gray-500 py-8">장바구니가 비어있습니다</p>
          </div>
          
          <div class="mt-4 border-t pt-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">총 금액</span>
              <span class="text-lg font-bold text-blue-600">0원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 토스트 컨테이너 렌더링
function renderToastContainer() {
  return `
    <div id="toast-container" class="fixed top-4 right-4 z-50 space-y-2">
      <!-- 토스트 메시지들이 여기에 동적으로 추가됩니다 -->
    </div>
  `;
}

// 장바구니 개수 가져오기 (임시)
function getCartCount() {
  // TODO: 실제 장바구니 스토어에서 가져오기
  return 0;
}

// 상태 구독 시스템 - Store 변경 시 자동 리렌더링
export function subscribeToStore() {
  productStore.subscribe((newState, prevState) => {
    console.log("Store 변경 감지 - 자동 리렌더링 시작", newState, prevState);

    // 현재 페이지 다시 렌더링
    render(currentPageType, currentParams);
  });
}

// 현재 페이지 타입 가져오기
export function getCurrentPageType() {
  return currentPageType;
}

// 현재 페이지 파라미터 가져오기
export function getCurrentParams() {
  return currentParams;
}
