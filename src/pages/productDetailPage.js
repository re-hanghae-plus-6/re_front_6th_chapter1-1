import { getProduct } from "../api/productApi";
import { setupCartEventListeners, updateCartCount } from "../utils/cartHandler.js";

const root = document.getElementById("root");

// 상품 상세 페이지 로딩 상태 렌더링
const renderLoading = () => {
  root.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
            </div>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main class="max-w-md mx-auto px-4 py-4">
        <div class="py-20 bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">상품 정보를 불러오는 중...</p>
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

// 별점 렌더링 함수
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = "";

  // 완전한 별들
  for (let i = 0; i < fullStars; i++) {
    starsHTML += `
      <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    `;
  }

  // 반별 (있는 경우)
  if (hasHalfStar) {
    starsHTML += `
      <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="half-star">
            <stop offset="50%" stop-color="currentColor"/>
            <stop offset="50%" stop-color="#d1d5db"/>
          </linearGradient>
        </defs>
        <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    `;
  }

  // 빈 별들
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `
      <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    `;
  }

  return starsHTML;
};

// 상품 상세 페이지 렌더링
const renderProductDetail = (product) => {
  const { productId, title, image, lprice, brand, category1, category2, description, rating, reviewCount, stock } =
    product;

  root.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
            </div>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 브레드크럼 -->
        <nav class="mb-4">
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            ${
              category1
                ? `
              <button class="breadcrumb-link" data-category1="${category1}">
                ${category1}
              </button>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            `
                : ""
            }
            ${
              category2
                ? `
              <button class="breadcrumb-link" data-category2="${category2}">
                ${category2}
              </button>
            `
                : ""
            }
          </div>
        </nav>
        <!-- 상품 상세 정보 -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <!-- 상품 이미지 -->
          <div class="p-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img src="${image}" alt="${title}" class="w-full h-full object-cover product-detail-image">
            </div>
            <!-- 상품 정보 -->
            <div>
              <p class="text-sm text-gray-600 mb-1">${brand || ""}</p>
              <h1 class="text-xl font-bold text-gray-900 mb-3">${title}</h1>
              <!-- 평점 및 리뷰 -->
              <div class="flex items-center mb-3">
                <div class="flex items-center">
                  ${renderStars(rating || 4.0)}
                </div>
                <span class="ml-2 text-sm text-gray-600">${rating || 4.0} (${reviewCount || 749}개 리뷰)</span>
              </div>
              <!-- 가격 -->
              <div class="mb-4">
                <span class="text-2xl font-bold text-blue-600">${lprice}원</span>
              </div>
              <!-- 재고 -->
              <div class="text-sm text-gray-600 mb-4">
                재고 ${stock || 107}개
              </div>
              <!-- 설명 -->
              <div class="text-sm text-gray-700 leading-relaxed mb-6">
                ${description || `${title}에 대한 상세 설명입니다. ${brand || "브랜드"}의 우수한 품질을 자랑하는 상품으로, 고객 만족도가 높은 제품입니다.`}
              </div>
            </div>
          </div>
          <!-- 수량 선택 및 액션 -->
          <div class="border-t border-gray-200 p-4">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-gray-900">수량</span>
              <div class="flex items-center">
                <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                   rounded-l-md bg-gray-50 hover:bg-gray-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <input type="number" id="quantity-input" value="1" min="1" max="${stock || 107}" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
                  focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                   rounded-r-md bg-gray-50 hover:bg-gray-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>
            <!-- 액션 버튼 -->
            <button id="add-to-cart-btn" data-product-id="${productId}" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                 hover:bg-blue-700 transition-colors font-medium">
              장바구니 담기
            </button>
          </div>
        </div>
        <!-- 상품 목록으로 이동 -->
        <div class="mb-6">
          <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
            hover:bg-gray-200 transition-colors go-to-product-list">
            상품 목록으로 돌아가기
          </button>
        </div>
        <!-- 관련 상품 -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
            <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
          </div>
          <div class="p-4">
            <div class="grid grid-cols-2 gap-3 responsive-grid">
              <!-- 관련 상품들은 동적으로 로드될 예정 -->
              <div class="text-center text-gray-500 py-8">
                <p>관련 상품을 불러오는 중...</p>
              </div>
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

  // 이벤트 리스너 설정
  setupEventListeners(product);
  setupCartEventListeners();
  updateCartCount();
};

// 이벤트 리스너 설정
const setupEventListeners = (product) => {
  // 수량 증가 버튼
  const increaseBtn = document.getElementById("quantity-increase");
  const decreaseBtn = document.getElementById("quantity-decrease");
  const quantityInput = document.getElementById("quantity-input");

  if (increaseBtn) {
    increaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value);
      const maxValue = parseInt(quantityInput.max);
      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
      }
    });
  }

  if (decreaseBtn) {
    decreaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
  }

  // 수량 직접 입력
  if (quantityInput) {
    quantityInput.addEventListener("change", () => {
      const value = parseInt(quantityInput.value);
      const maxValue = parseInt(quantityInput.max);
      if (value < 1) {
        quantityInput.value = 1;
      } else if (value > maxValue) {
        quantityInput.value = maxValue;
      }
    });
  }

  // 장바구니 담기 버튼
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const quantity = parseInt(quantityInput.value);
      const productData = {
        ...product,
        quantity: quantity,
      };

      // 장바구니에 추가 (cartHandler의 addToCart 함수 사용)
      import("../utils/cartHandler.js").then(({ addToCart }) => {
        addToCart(productData);
      });
    });
  }

  // 상품 목록으로 돌아가기 버튼
  const goToListBtn = document.querySelector(".go-to-product-list");
  if (goToListBtn) {
    goToListBtn.addEventListener("click", () => {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  }

  // 브레드크럼 링크
  const breadcrumbLinks = document.querySelectorAll(".breadcrumb-link");
  breadcrumbLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const category1 = link.getAttribute("data-category1");
      const category2 = link.getAttribute("data-category2");

      if (category1) {
        window.history.pushState({}, "", `/?category1=${category1}`);
      } else if (category2) {
        window.history.pushState({}, "", `/?category2=${category2}`);
      }
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  });
};

// 상품 상세 페이지 메인 함수
export const productDetailPage = async (productId) => {
  try {
    renderLoading();

    const product = await getProduct(productId);

    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }

    renderProductDetail(product);
  } catch (error) {
    console.error("상품 상세 로딩 실패:", error);
    root.innerHTML = `
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <h2 class="text-xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h2>
          <p class="text-gray-600 mb-6">요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
          <button onclick="window.history.back()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    `;
  }
};
