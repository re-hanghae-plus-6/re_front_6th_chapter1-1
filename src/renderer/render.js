import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { productStore } from "../store/productStore.js";
import { cartStore, cartSelectors } from "../store/cartStore.js";
import { Home, loadProducts } from "../pages/Home.js";

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
  `;
}

// 홈 페이지 콘텐츠 렌더링
function renderHomeContent() {
  // 상품 자동 로드 체크
  const state = productStore.getState();

  // 자동 로드 조건: 상품이 없고, 에러가 없고, 로딩 중이 아니고, 이미 로드 시도 중이 아니고,
  // 페이지가 1페이지이고, 한 번도 로드한 적이 없고, 무한 스크롤 중이 아닐 때만
  const shouldAutoLoad =
    state.products.length === 0 &&
    !state.error &&
    !state.isLoading &&
    !renderHomeContent.isLoading &&
    state.pagination.currentPage === 1 &&
    !renderHomeContent.hasInitiallyLoaded &&
    !window.isInfiniteScrolling;

  if (shouldAutoLoad) {
    renderHomeContent.isLoading = true;
    renderHomeContent.hasInitiallyLoaded = true;
    loadProducts().finally(() => {
      renderHomeContent.isLoading = false;
    });
  }

  // Home 컴포넌트 사용
  return Home();
}

// 상품 상세 페이지 콘텐츠 렌더링
function renderProductDetailContent(params) {
  const { id } = params;

  return `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="text-center py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">상품 ID: ${id} - PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장</h1>
        
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
function render404Content() {
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

// 장바구니 개수 가져오기
function getCartCount() {
  return cartSelectors.getTotalCount();
}

// 상태 구독 시스템 - Store 변경 시 자동 리렌더링
export function subscribeToStore() {
  productStore.subscribe((newState, prevState) => {
    // 렌더링이 필요한 변경사항인지 확인
    const shouldRender =
      newState.products !== prevState.products ||
      newState.isLoading !== prevState.isLoading ||
      newState.error !== prevState.error ||
      newState.filters !== prevState.filters ||
      newState.total !== prevState.total;

    // 무한 스크롤 로딩 중에만 렌더링 스킵
    const isInfiniteScrollLoading =
      newState.isLoading && newState.pagination.currentPage > 1 && prevState.products.length > 0;

    if (shouldRender && !isInfiniteScrollLoading) {
      // 현재 페이지 다시 렌더링
      render(currentPageType, currentParams);
    }
  });

  // 장바구니 상태 구독
  cartStore.subscribe((newState, prevState) => {
    // 장바구니 카운트 변경사항이 있으면 리렌더링
    const shouldRender = newState.productIds.length !== prevState.productIds.length;

    if (shouldRender) {
      render(currentPageType, currentParams);
    }
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
