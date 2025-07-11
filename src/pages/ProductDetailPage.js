import { getProduct, getProducts } from "../api/productApi.js";
import { Footer } from "./Footer.js";
import { showToast } from "../components/Toast.js";
import { cartStore } from "../stores/index.js";
import { formatPrice } from "../utils/formatters.js";
import { getFullPath } from "../utils/pathUtils.js";

// 중복 호출 방지를 위한 전역 변수
let isLoadingProduct = false;
let currentLoadingProductId = null;

// 브레드크럼 이벤트 바인딩 함수
function bindBreadcrumbEvents(product) {
  // 홈 링크 이벤트
  const homeLink = document.querySelector('a[data-link=""]');
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", getFullPath("/"));
      window.location.reload(); // 홈으로 이동 시 새로고침으로 깔끔하게 초기화
    });
  }

  // 카테고리 1 depth 링크 이벤트
  const category1Link = document.querySelector(`button[data-category1="${product.category1}"]`);
  if (category1Link) {
    category1Link.addEventListener("click", (e) => {
      e.preventDefault();
      // 카테고리 1 depth로 이동 (홈으로 이동 후 카테고리 필터링)
      const targetUrl = getFullPath("/?category1=" + encodeURIComponent(product.category1));
      window.history.pushState({}, "", targetUrl);
      window.location.reload(); // 카테고리 필터링된 홈으로 이동
    });
  }

  // 카테고리 2 depth 링크 이벤트
  const category2Link = document.querySelector(`button[data-category2="${product.category2}"]`);
  if (category2Link) {
    category2Link.addEventListener("click", (e) => {
      e.preventDefault();
      // 카테고리 2 depth로 이동 (홈으로 이동 후 카테고리 필터링)
      const targetUrl = getFullPath(
        "/?category1=" + encodeURIComponent(product.category1) + "&category2=" + encodeURIComponent(product.category2),
      );
      window.history.pushState({}, "", targetUrl);
      window.location.reload(); // 카테고리 필터링된 홈으로 이동
    });
  }
}

export async function ProductDetailPage({ productId }) {
  const callStack = new Error().stack;
  console.log("🏪 ProductDetailPage: 시작", {
    productId,
    timestamp: Date.now(),
    isLoadingProduct,
    currentLoadingProductId,
    callStack: callStack?.split("\n").slice(0, 5).join("\n"), // 호출 스택 상위 5개만
  });

  // 중복 호출 방지
  if (isLoadingProduct && currentLoadingProductId === productId) {
    console.log("⚠️ ProductDetailPage: 중복 호출 감지, 건너뛰기", { productId });
    return;
  }

  // 로딩 상태 설정
  isLoadingProduct = true;
  currentLoadingProductId = productId;

  try {
    // 상품 데이터 fetch
    console.log("🔍 ProductDetailPage: 상품 상세 API 호출", { productId });
    const product = await getProduct(productId);

    // 관련 상품 데이터 fetch (같은 category2, 현재 상품 제외)
    console.log("🔍 ProductDetailPage: 관련 상품 API 호출", { category2: product.category2 });
    const relatedProductsResponse = await getProducts({
      page: 1,
      limit: 20,
      category2: product.category2,
      sort: "price_asc",
    });

    // 현재 상품을 제외한 관련 상품들 (전체 호출)
    const relatedProducts = relatedProductsResponse.products.filter((p) => p.productId !== product.productId);

    console.log("✅ ProductDetailPage: 모든 API 호출 완료", {
      productId,
      relatedCount: relatedProducts.length,
    });

    // 페이지 렌더링
    document.getElementById("root").innerHTML = `
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
              <a href="${getFullPath("/")}" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <button class="breadcrumb-link hover:text-blue-600 transition-colors" data-category1="${product.category1}">
                ${product.category1}
              </button>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <button class="breadcrumb-link hover:text-blue-600 transition-colors" data-category2="${product.category2}">
                ${product.category2}
              </button>
            </div>
          </nav>
          <!-- 상품 상세 정보 -->
          <div class="bg-white rounded-lg shadow-sm mb-6">
            <!-- 상품 이미지 -->
            <div class="p-4">
              <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover product-detail-image">
              </div>
              <!-- 상품 정보 -->
              <div>
                <p class="text-sm text-gray-600 mb-1">${product.brand}</p>
                <h1 class="text-xl font-bold text-gray-900 mb-3">${product.title}</h1>
                <!-- 평점 및 리뷰 -->
                <div class="flex items-center mb-3">
                  <div class="flex items-center">
                    ${Array.from({ length: 5 }, (_, i) => {
                      const rating = product.rating || 0;
                      // 별의 상태를 계산
                      // i는 0부터 시작하므로, i < rating은 전체 별 개수
                      // 데이터는 정수 값만 있을 것 같지만 보통 평점은 x.x 단위로 있을 수 있으므로 0.5 이상이면 별을 채워서 보여주는 로직
                      const isFullStar = i < Math.floor(rating);
                      const isHalfStar = i === Math.floor(rating) && rating % 1 >= 0.5;

                      if (isFullStar) {
                        return `<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>`;
                      } else if (isHalfStar) {
                        return `<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <defs>
                            <linearGradient id="half-star">
                              <stop offset="50%" stop-color="currentColor"/>
                              <stop offset="50%" stop-color="#d1d5db"/>
                            </linearGradient>
                          </defs>
                          <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>`;
                      } else {
                        return `<svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>`;
                      }
                    }).join("")}
                  </div>
                  <span class="ml-2 text-sm text-gray-600">${(product.rating || 0).toFixed(1)} (${product.reviewCount}개 리뷰)</span>
                </div>
                <!-- 가격 -->
                <div class="mb-4">
                  <span class="text-2xl font-bold text-blue-600">${formatPrice(product.lprice)}원</span>
                </div>
                <!-- 재고 -->
                <div class="text-sm text-gray-600 mb-4">
                  재고 ${product.stock || 0}개
                </div>
                <!-- 설명 -->
                <div class="text-sm text-gray-700 leading-relaxed mb-6">
                  ${product.description || `${product.title}에 대한 상세 설명입니다. 브랜드의 우수한 품질을 자랑하는 상품으로, 고객 만족도가 높은 제품입니다.`}
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
                  <input type="number" id="quantity-input" value="1" min="1" max="${product.stock || 99}" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
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
              <button id="add-to-cart-btn" data-product-id="${product.productId}" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
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
          ${
            relatedProducts.length > 0
              ? `
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
              <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-2 gap-3 responsive-grid">
                ${relatedProducts
                  .map(
                    (relatedProduct) => `
                  <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${relatedProduct.productId}">
                    <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                      <img src="${relatedProduct.image}" alt="${relatedProduct.title}" class="w-full h-full object-cover" loading="lazy">
                    </div>
                    <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${relatedProduct.title}</h3>
                    <p class="text-sm font-bold text-blue-600">${formatPrice(relatedProduct.lprice)}원</p>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          </div>
          `
              : ""
          }
        </main>
        ${Footer()}
      </div>
    `;

    // 4. 이벤트 바인딩
    document.querySelector(".go-to-product-list").onclick = () => {
      window.history.pushState({}, "", getFullPath("/"));
      window.dispatchEvent(new Event("popstate"));
    };

    // 수량 증가/감소 버튼 이벤트
    const quantityInput = document.getElementById("quantity-input");
    const quantityDecrease = document.getElementById("quantity-decrease");
    const quantityIncrease = document.getElementById("quantity-increase");

    quantityDecrease.onclick = () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    };

    quantityIncrease.onclick = () => {
      const currentValue = parseInt(quantityInput.value);
      const maxValue = parseInt(quantityInput.max);
      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
      }
    };

    // 관련 상품 클릭 이벤트
    document.querySelectorAll(".related-product-card").forEach((card) => {
      card.onclick = () => {
        const productId = card.getAttribute("data-product-id");
        window.history.pushState({}, "", getFullPath(`/product/${productId}`));
        window.dispatchEvent(new Event("popstate"));
      };
    });

    document.getElementById("add-to-cart-btn").onclick = () => {
      try {
        const productId = product.productId;
        const quantity = parseInt(quantityInput.value);

        // 상품 ID 유효성 검사
        if (!productId) {
          showToast("error");
          return;
        }

        // 수량 유효성 검사
        if (quantity < 1 || isNaN(quantity)) {
          showToast("error");
          return;
        }

        // cartStore를 통한 장바구니 추가
        cartStore.addItem(productId, quantity);
        showToast("add");

        // 장바구니 뱃지 업데이트 (메인 페이지로 돌아갔을 때 반영되도록)
        updateCartCountBadge();
      } catch (error) {
        console.error("장바구니 담기 중 오류 발생:", error);
        showToast("error");
      }
    };

    // 장바구니 개수 뱃지 업데이트 함수 (상세 페이지용, store 기반)
    function updateCartCountBadge() {
      const cartBtn = document.getElementById("cart-icon-btn");
      if (!cartBtn) return;

      const uniqueProductCount = cartStore.getUniqueProductCount();

      // 기존 뱃지 찾기
      let badge = cartBtn.querySelector(".cart-badge");

      if (uniqueProductCount > 0) {
        // 뱃지가 없으면 생성, 있으면 재사용
        if (!badge) {
          badge = document.createElement("span");
          badge.className =
            "cart-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
          cartBtn.appendChild(badge);
        }
        badge.textContent = uniqueProductCount;
      } else {
        // 장바구니가 비어있으면 뱃지 제거
        if (badge) {
          badge.remove();
        }
      }
    }

    // 페이지 로드 시 장바구니 뱃지 업데이트
    updateCartCountBadge();

    // 브레드크럼 이벤트 바인딩
    bindBreadcrumbEvents(product);
  } catch (error) {
    console.error("상품 상세 페이지 로딩 오류:", error);
    document.getElementById("root").innerHTML = `
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
            </div>
          </div>
        </header>
        <main class="max-w-md mx-auto px-4 py-4">
          <div class="py-20 bg-gray-50 flex items-center justify-center">
            <div class="text-center">
              <div class="mb-4">
                <svg class="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900 mb-2">상품 정보를 불러올 수 없습니다</h2>
              <p class="text-gray-600 mb-4">네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.</p>
              <button onclick="window.location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                새로고침
              </button>
            </div>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  } finally {
    // 로딩 상태 초기화
    isLoadingProduct = false;
    currentLoadingProductId = null;

    // 렌더링 다시 활성화 (상세 페이지 로딩 완료 후, render() 호출하지 않음)
    if (window.enableRendering) {
      window.enableRendering();
    }
  }
}
