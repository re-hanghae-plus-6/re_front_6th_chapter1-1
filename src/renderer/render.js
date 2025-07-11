import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { productStore } from "../store/productStore.js";
import { cartStore, cartSelectors } from "../store/cartStore.js";
import { Home, loadProducts } from "../pages/Home.js";
import { getProduct } from "../api/productApi.js";

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

  if (!id) {
    return `
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="text-center py-8">
          <p class="text-red-500">상품 ID가 없습니다.</p>
        </div>
      </div>
    `;
  }

  // 로딩 상태 표시
  const loadingHtml = `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">상품 정보를 불러오는 중...</p>
      </div>
    </div>
  `;

  // 비동기적으로 상품 정보를 불러와서 렌더링
  loadProductDetail(id);

  return loadingHtml;
}

// 상품 상세 정보 로딩 함수
async function loadProductDetail(productId) {
  try {
    const product = await getProduct(productId);

    // 관련 상품 생성 (같은 카테고리의 다른 상품들)
    const relatedProducts = await getRelatedProducts(product.category2, productId);

    // 실제 상품 정보로 페이지 업데이트
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = renderProductDetailHTML(product, relatedProducts);
    }
  } catch (error) {
    console.error("상품 상세 정보 로딩 실패:", error);

    // 에러 상태 표시
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="text-center py-8">
            <p class="text-red-500 mb-4">상품 정보를 불러오는데 실패했습니다.</p>
            <button onclick="window.history.back()" class="bg-blue-600 text-white px-4 py-2 rounded">
              뒤로가기
            </button>
          </div>
        </div>
      `;
    }
  }
}

// 관련 상품 가져오기 함수
async function getRelatedProducts(category2, currentProductId) {
  try {
    // 같은 카테고리의 상품들을 가져오기
    const response = await fetch(`/api/products?category2=${category2}&limit=6`);
    const data = await response.json();

    // 현재 상품 제외하고 최대 4개까지만 반환
    return data.products.filter((product) => product.productId !== currentProductId).slice(0, 4);
  } catch (error) {
    console.error("관련 상품 로딩 실패:", error);
    return [];
  }
}

// 상품 상세 HTML 생성 함수
function renderProductDetailHTML(product, relatedProducts) {
  const price = product.lprice ? parseInt(product.lprice) : 0;
  const rating = product.rating || 4;
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 1000) + 50;
  const stock = product.stock || Math.floor(Math.random() * 100) + 10;

  return `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="text-center py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">${product.title}</h1>
        
        <!-- 상품 이미지 -->
        <div class="mb-6">
          <img src="${product.image}" 
               alt="${product.title}"
               class="w-full h-64 object-cover rounded-lg">
        </div>
        
        <!-- 가격 -->
        <p class="text-2xl font-bold text-gray-900 mb-6">${price.toLocaleString()}원</p>
        
        <!-- 상품 정보 -->
        <div class="text-left mb-6">
          <p class="text-gray-600 mb-2">브랜드: ${product.brand || "정보없음"}</p>
          <p class="text-gray-600 mb-2">카테고리: ${product.category1} > ${product.category2}</p>
          <p class="text-gray-600 mb-2">평점: ${rating}점 (${reviewCount}개 리뷰)</p>
          <p class="text-gray-600 mb-4">재고: ${stock}개</p>
          <p class="text-gray-700 text-sm">${product.description || `${product.title}에 대한 상세 설명입니다.`}</p>
        </div>
        
        <!-- 수량 선택 -->
        <div class="flex items-center justify-center gap-4 mb-6">
          <button id="quantity-decrease" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">-</button>
          <input type="number" id="quantity-input" value="1" min="1" class="w-16 text-center border border-gray-300 rounded-md py-2">
          <button id="quantity-increase" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">+</button>
        </div>
        
        <!-- 장바구니 담기 버튼 -->
        <button id="add-to-cart-btn" data-product-id="${product.productId}" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          장바구니 담기
        </button>
      </div>
      
      <div class="mt-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">관련 상품</h2>
        <div class="grid grid-cols-2 gap-4">
          ${renderRelatedProducts(relatedProducts)}
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
function renderRelatedProducts(products) {
  return products
    .map((product) => {
      const price = product.lprice ? parseInt(product.lprice) : 0;
      return `
      <div class="related-product-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer" 
          data-product-id="${product.productId}">
       <img src="${product.image}" alt="${product.title}" class="w-full h-20 object-cover">
       <div class="p-2">
         <h4 class="text-xs font-medium text-gray-900 mb-1">${product.title}</h4>
         <p class="text-sm font-bold text-gray-900">${price.toLocaleString()}원</p>
       </div>
      </div>
    `;
    })
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

    // 무한 스크롤 로딩 중인지 확인
    const isInfiniteScrollLoading =
      newState.isLoading && newState.pagination.currentPage > 1 && prevState.products.length > 0;

    if (shouldRender) {
      if (isInfiniteScrollLoading) {
        // 무한 스크롤 중: 상품 목록만 부분 업데이트
        updateProductListOnly(newState);
      } else {
        // 일반적인 경우: 전체 페이지 리렌더링
        render(currentPageType, currentParams);
      }
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

// 무한 스크롤 시 상품 목록만 부분 업데이트
function updateProductListOnly(state) {
  const { products = [], total = 0 } = state;

  // 상품 그리드 요소 찾기
  const productsGrid = document.querySelector("#products-grid");
  const productCountElement = document.querySelector("[data-testid='product-total']");

  if (productsGrid && productCountElement) {
    // 상품 카운트 업데이트
    productCountElement.textContent = total.toLocaleString();

    // 새로운 상품 카드들만 추가 (기존 카드는 유지)
    const existingCards = productsGrid.querySelectorAll(".product-card");
    const existingCount = existingCards.length;

    // 새로 추가된 상품들만 렌더링
    const newProducts = products.slice(existingCount);

    if (newProducts.length > 0) {
      const newCardsHTML = newProducts.map((product) => renderProductCard(product)).join("");
      productsGrid.insertAdjacentHTML("beforeend", newCardsHTML);
    }
  }
}

// 개별 상품 카드 렌더링 함수 (재사용을 위해 export)
function renderProductCard(product) {
  return `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" 
         data-product-id="${product.productId}">
      <!-- 상품 이미지 -->
      <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
        <img src="${product.image}" 
             alt="${product.title}"
             class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
             loading="lazy">
      </div>
      
      <!-- 상품 정보 -->
      <div class="p-3">
        <div class="cursor-pointer product-info mb-3">
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
            ${product.title}
          </h3>
          ${product.brand ? `<p class="text-xs text-gray-500 mb-2">${product.brand}</p>` : ""}
          <p class="text-lg font-bold text-gray-900">
            ${parseInt(product.lprice).toLocaleString()}원
          </p>
        </div>
        
        <!-- 장바구니 버튼 -->
        <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" 
                data-product-id="${product.productId}">
          장바구니 담기
        </button>
      </div>
    </div>
  `;
}

// 현재 페이지 타입 가져오기
export function getCurrentPageType() {
  return currentPageType;
}

// 현재 페이지 파라미터 가져오기
export function getCurrentParams() {
  return currentParams;
}
