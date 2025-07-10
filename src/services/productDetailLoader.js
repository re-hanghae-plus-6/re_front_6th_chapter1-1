import { getProduct, getProducts } from "../api/productApi";
import ErrorContent from "../components/error/ErrorContent";
import { Toast } from "../components/Toast";
import { CartStorage } from "../utils/CartStorage";
import { formatCurrency } from "../utils/formatUtils";
import { navigateTo } from "../utils/router";

/**
 * 상품 상세 정보를 로딩하고 렌더링하는 함수
 */
export const loadProductDetail = async (productId) => {
  const detailContainer = document.getElementById("product-detail");
  if (!detailContainer) return;

  try {
    const product = await getProduct(productId);
    const { products: relatedProducts } = await getProducts({
      category1: product.category1,
      category2: product.category2,
    });

    detailContainer.innerHTML = renderProductDetail(product, relatedProducts);

    // 이벤트 리스너 연결
    initializeProductDetailEvents(product);
  } catch (error) {
    console.error("상품 상세 불러오기 실패:", error);
    detailContainer.innerHTML = ErrorContent("상품 정보를 불러올 수 없어요. 😥", "product-detail-retry");

    // 재시도 이벤트 연결
    const retryButton = document.getElementById("product-detail-retry");
    retryButton?.addEventListener("click", () => {
      loadProductDetail(productId);
    });
  }
};

/**
 * 상품 상세 페이지 렌더링
 */
function renderProductDetail(product, relatedProducts) {
  const { productId, title, image, lprice, brand, category1, category2, rating, reviewCount, stock, description } =
    product;

  return /* HTML */ `
    <!-- 브레드크럼 -->
    <nav class="mb-4">
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <button class="breadcrumb-link" data-category1="${category1}">${category1}</button>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <button class="breadcrumb-link" data-category2="${category2}">${category2}</button>
      </div>
    </nav>
    <!-- 상품 상세 정보 -->
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <!-- 상품 이미지 -->
      <div class="p-4">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img src=${image} alt=${title} class="w-full h-full object-cover product-detail-image" />
        </div>
        <!-- 상품 정보 -->
        <div>
          <p class="text-sm text-gray-600 mb-1">${brand}</p>
          <h1 class="text-xl font-bold text-gray-900 mb-3">${title}</h1>
          <!-- 평점 및 리뷰 -->
          <div class="flex items-center mb-3">
            <div class="flex items-center">${generateStarRating(rating)}</div>
            <span class="ml-2 text-sm text-gray-600">${rating} (${reviewCount}개 리뷰)</span>
          </div>
          <!-- 가격 -->
          <div class="mb-4">
            <span class="text-2xl font-bold text-blue-600">${formatCurrency(lprice)}원</span>
          </div>
          <!-- 재고 -->
          <div class="text-sm text-gray-600 mb-4">재고 ${stock}개</div>
          <!-- 설명 -->
          <div class="text-sm text-gray-700 leading-relaxed mb-6">${description}</div>
        </div>
      </div>
      <!-- 수량 선택 및 액션 -->
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-900">수량</span>
          <div class="flex items-center">
            <button
              id="quantity-decrease"
              class="w-8 h-8 flex items-center justify-center border border-gray-300 
             rounded-l-md bg-gray-50 hover:bg-gray-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <input
              type="number"
              id="quantity-input"
              value="1"
              min="1"
              max="${stock}"
              class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
              focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              id="quantity-increase"
              class="w-8 h-8 flex items-center justify-center border border-gray-300 
             rounded-r-md bg-gray-50 hover:bg-gray-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 액션 버튼 -->
        <button
          id="add-to-cart-btn"
          data-product-id="${productId}"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
        hover:bg-blue-700 transition-colors font-medium"
        >
          장바구니 담기
        </button>
      </div>
    </div>
    <!-- 상품 목록으로 이동 -->
    <div class="mb-6">
      <button
        class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
      hover:bg-gray-200 transition-colors go-to-product-list"
      >
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
          ${relatedProducts
            .map((product) => {
              return /* HTML */ `
                <div
                  class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer"
                  data-product-id="${product.productId}"
                >
                  <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                    <img
                      src="${product.image}"
                      alt=${product.title}
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${product.title}</h3>
                  <p class="text-sm font-bold text-blue-600">${formatCurrency(product.lprice)}원</p>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    </div>
  `;
}

/**
 * 별점 렌더링 함수
 */
function generateStarRating(rating = 0) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
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
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
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
}

/**
 * 상품 상세 페이지 이벤트 리스너 초기화
 */
function initializeProductDetailEvents(product) {
  // 수량 조절 이벤트
  const quantityInput = document.getElementById("quantity-input");
  const decreaseBtn = document.getElementById("quantity-decrease");
  const increaseBtn = document.getElementById("quantity-increase");

  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value) || 1;
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    increaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value) || 1;
      const maxValue = parseInt(quantityInput.max) || product.stock || 999;
      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
      }
    });

    quantityInput.addEventListener("input", () => {
      const value = parseInt(quantityInput.value) || 1;
      const maxValue = parseInt(quantityInput.max) || product.stock || 999;
      if (value < 1) quantityInput.value = 1;
      if (value > maxValue) quantityInput.value = maxValue;
    });
  }

  // 장바구니 추가 이벤트
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const quantity = parseInt(quantityInput?.value) || 1;
      const productData = {
        productId: product.productId,
        title: product.title,
        image: product.image,
        lprice: product.lprice,
        brand: product.brand,
        quantity: quantity,
      };

      CartStorage.save(productData);
      Toast.success("장바구니에 추가되었습니다!");
    });
  }

  // 관련 상품 클릭 이벤트
  const relatedProductCards = document.querySelectorAll(".related-product-card");
  relatedProductCards.forEach((card) => {
    card.addEventListener("click", () => {
      const productId = card.getAttribute("data-product-id");
      if (productId) {
        navigateTo(`/product/${productId}`);
      }
    });
  });

  // 상품 목록으로 돌아가기 버튼
  const goToListBtn = document.querySelector(".go-to-product-list");
  if (goToListBtn) {
    goToListBtn.addEventListener("click", () => {
      navigateTo("/");
    });
  }

  // 브레드크럼 이벤트 처리
  setupBreadcrumbEvents(product);
}

/**
 * 브레드크럼 이벤트 설정
 */
function setupBreadcrumbEvents(product) {
  const breadcrumbLinks = document.querySelectorAll(".breadcrumb-link");
  const { category1, category2 } = product;

  breadcrumbLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // 인덱스로 조건 분기
      if (index === 0) {
        // category1 클릭 - category1만
        navigateTo(`/?category1=${encodeURIComponent(category1)}`);
      } else if (index === 1) {
        // category2 클릭 - category1 + category2
        navigateTo(`/?category1=${encodeURIComponent(category1)}&category2=${encodeURIComponent(category2)}`);
      }
    });
  });
}
